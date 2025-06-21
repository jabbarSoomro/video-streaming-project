import express from 'express';
import multer from 'multer';

import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import cors from 'cors';
import dotenv from 'dotenv';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffprobePath from '@ffprobe-installer/ffprobe';
import ffmpeg from 'fluent-ffmpeg';




ffmpeg.setFfmpegPath(ffmpegPath.path);
ffmpeg.setFfprobePath(ffprobePath.path);

// __dirname workaround for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};
async function initDatabase() {
  const connection = await mysql.createConnection(dbConfig);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS videos (
                                        id INT AUTO_INCREMENT PRIMARY KEY,
                                        title VARCHAR(255) NOT NULL,
      filename VARCHAR(255) NOT NULL,
      duration FLOAT NOT NULL,
      upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      thumbnail VARCHAR(255),
      status ENUM('uploading', 'processing', 'ready', 'error') DEFAULT 'uploading'
      )
  `);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS video_chunks (
                                              id INT AUTO_INCREMENT PRIMARY KEY,
                                              video_id INT,
                                              chunk_number INT,
                                              resolution ENUM('240p', '360p', '480p', '720p'),
      filename VARCHAR(255),
      start_time FLOAT,
      end_time FLOAT,
      FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
      INDEX idx_video_resolution (video_id, resolution),
      INDEX idx_chunk_number (chunk_number)
      )
  `);

  await connection.end();
}

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|avi|mov|wmv|flv|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) cb(null, true);
    else cb(new Error('Only video files are allowed'));
  },
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});

// Helpers
async function getVideoDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata.format.duration);
    });
  });
}

async function generateThumbnail(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
        .screenshots({
          count: 1,
          folder: path.dirname(outputPath),
          filename: path.basename(outputPath),
          timemarks: ['10%']
        })
        .on('end', resolve)
        .on('error', reject);
  });
}

async function createVideoChunks(videoId, inputPath, duration) {
  const resolutions = [
    { name: '240p', size: '426x240', bitrate: '300k' },
    { name: '360p', size: '640x360', bitrate: '600k' },
    { name: '480p', size: '854x480', bitrate: '1000k' },
    { name: '720p', size: '1280x720', bitrate: '2500k' }
  ];

  const chunkDuration = 10;
  const totalChunks = Math.ceil(duration / chunkDuration);
  const connection = await mysql.createConnection(dbConfig);

  for (const resolution of resolutions) {
    const resolutionDir = path.join(__dirname, `uploads/chunks/${videoId}/${resolution.name}`);
    await fs.mkdir(resolutionDir, { recursive: true });

    for (let i = 0; i < totalChunks; i++) {
      const startTime = i * chunkDuration;
      const endTime = Math.min((i + 1) * chunkDuration, duration);
      const chunkFilename = `chunk_${i}.mp4`;
      const outputPath = path.join(resolutionDir, chunkFilename);

      await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .output(outputPath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .size(resolution.size)
            .videoBitrate(resolution.bitrate)
            .seekInput(startTime)
            .duration(endTime - startTime)
            .on('end', resolve)
            .on('error', reject)
            .run();
      });

      await connection.execute(`
            INSERT INTO video_chunks (video_id, chunk_number, resolution, filename, start_time, end_time)
            VALUES (?, ?, ?, ?, ?, ?)`,
          [videoId, i, resolution.name, `chunks/${videoId}/${resolution.name}/${chunkFilename}`, startTime, endTime]);
    }
  }

  await connection.end();
}

// Video Upload Endpoint
app.post('/api/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No video file uploaded' });

    const { originalname } = req.file;
    const filePath = req.file.path;
    const title = req.body.title || originalname;
    const duration = await getVideoDuration(filePath);

    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
        'INSERT INTO videos (title, filename, duration, status) VALUES (?, ?, ?, ?)',
        [title, req.file.filename, duration, 'processing']
    );
    const videoId = result.insertId;

    const thumbnailPath = path.join(__dirname, `uploads/thumbnails/${videoId}.jpg`);
    await fs.mkdir(path.dirname(thumbnailPath), { recursive: true });
    await generateThumbnail(filePath, thumbnailPath);

    await connection.execute(
        'UPDATE videos SET thumbnail = ? WHERE id = ?',
        [`thumbnails/${videoId}.jpg`, videoId]
    );

    await connection.end();
    processVideoChunks(videoId, filePath, duration);

    res.json({ message: 'Video uploaded successfully', videoId, status: 'processing' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

async function processVideoChunks(videoId, filePath, duration) {
  try {
    await createVideoChunks(videoId, filePath, duration);

    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('UPDATE videos SET status = ? WHERE id = ?', ['ready', videoId]);
    await connection.end();
    console.log(`Video ${videoId} processing completed`);
  } catch (error) {
    console.error(`Error processing video ${videoId}:`, error);

    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('UPDATE videos SET status = ? WHERE id = ?', ['error', videoId]);
    await connection.end();
  }
}

// API Endpoints
app.get('/api/videos', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
        'SELECT id, title, duration, upload_date, thumbnail, status FROM videos ORDER BY upload_date DESC'
    );
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

app.get('/api/videos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM videos WHERE id = ?', [id]);
    await connection.end();

    if (!rows.length) return res.status(404).json({ error: 'Video not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

app.get('/api/videos/:id/resolutions', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
        'SELECT DISTINCT resolution FROM video_chunks WHERE video_id = ? ORDER BY resolution',
        [id]
    );
    await connection.end();
    res.json(rows.map(row => row.resolution));
  } catch (error) {
    console.error('Error fetching resolutions:', error);
    res.status(500).json({ error: 'Failed to fetch resolutions' });
  }
});

app.get('/api/videos/:id/chunks', async (req, res) => {
  try {
    const { id } = req.params;
    const resolution = typeof req.query.resolution === 'string' ? req.query.resolution : '720p';

    const limit = Number.isFinite(+req.query.limit) ? +req.query.limit : 10;
    const offset = Number.isFinite(+req.query.offset) ? +req.query.offset : 0;
    const videoId = Number.isFinite(+id) ? +id : null;

    if (!videoId) {
      return res.status(400).json({ error: 'Invalid video ID' });
    }

    // Validate limit and offset to prevent SQL injection
    if (limit < 0 || limit > 1000 || !Number.isInteger(limit)) {
      return res.status(400).json({ error: 'Invalid limit value' });
    }
    if (offset < 0 || !Number.isInteger(offset)) {
      return res.status(400).json({ error: 'Invalid offset value' });
    }

    console.log('Query Args:', { videoId, resolution, limit, offset });

    const connection = await mysql.createConnection(dbConfig);

    // Debug: Check if table exists and has data
    try {
      const [tableCheck] = await connection.execute('SHOW TABLES LIKE "video_chunks"');
      console.log('Table exists:', tableCheck.length > 0);

      if (tableCheck.length > 0) {
        const [countCheck] = await connection.execute('SELECT COUNT(*) as count FROM video_chunks WHERE video_id = ?', [videoId]);
        console.log('Rows for video_id', videoId, ':', countCheck[0].count);

        const [sampleData] = await connection.execute('SELECT * FROM video_chunks WHERE video_id = ? LIMIT 1', [videoId]);
        console.log('Sample data:', sampleData[0]);
      }
    } catch (debugError) {
      console.error('Debug query error:', debugError);
    }

    const [rows] = await connection.execute(
        `SELECT chunk_number, filename, start_time, end_time
         FROM video_chunks
         WHERE video_id = ? AND resolution = ?
         ORDER BY chunk_number
         LIMIT ${limit} OFFSET ${offset}`,
        [videoId, resolution]
    );

    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching chunks:', error);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      sql: error.sql
    });
    res.status(500).json({ error: 'Failed to fetch chunks', details: error.message });
  }
});
app.get('/api/videos/:id/chunk/:chunkNumber', async (req, res) => {
  try {
    const {id, chunkNumber} = req.params;
    const {resolution = '720p'} = req.query;

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
        'SELECT filename FROM video_chunks WHERE video_id = ? AND chunk_number = ? AND resolution = ?',
        [id, chunkNumber, resolution]
    );
    await connection.end();

    if (!rows.length) return res.status(404).json({error: 'Chunk not found'});

    const chunkPath = path.join(__dirname, 'uploads', rows[0].filename);
    try {
      await fs.access(chunkPath);
      res.sendFile(chunkPath);
    } catch {
      res.status(404).json({error: 'Chunk file not found'});
    }
  } catch (error) {
    console.error('Error serving chunk:', error);
    res.status(500).json({error: 'Failed to serve chunk'});
  }
});

// Initialize
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(console.error);

async function createDirectories() {
  const dirs = ['uploads', 'uploads/thumbnails', 'uploads/chunks'];
  for (const dir of dirs) {
    try {
      await fs.mkdir(path.join(__dirname, dir), { recursive: true });
    } catch (error) {
      console.error(`Error creating directory ${dir}:`, error);
    }
  }
}

createDirectories();