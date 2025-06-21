import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Settings, Upload, RotateCcw, FastForward, ArrowLeft, Clock, Eye, Maximize } from 'lucide-react';

// Router Component (Simple implementation)
const Router = ({ children, currentPath }) => {
    return children.find(child => child.props.path === currentPath) || children.find(child => child.props.path === '*');
};

const Route = ({ path, children }) => children;

const VideoStreamingPlatform = () => {
    const [currentPath, setCurrentPath] = useState('/');
    const [selectedVideoId, setSelectedVideoId] = useState(null);

    const navigate = (path, videoId = null) => {
        setCurrentPath(path);
        if (videoId) setSelectedVideoId(videoId);
        window.scrollTo(0, 0);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <style dangerouslySetInnerHTML={{
                __html: `
                    .slider::-webkit-slider-thumb {
                        appearance: none;
                        height: 16px;
                        width: 16px;
                        border-radius: 50%;
                        background: #3b82f6;
                        cursor: pointer;
                        border: 2px solid #ffffff;
                    }

                    .slider::-moz-range-thumb {
                        height: 16px;
                        width: 16px;
                        border-radius: 50%;
                        background: #3b82f6;
                        cursor: pointer;
                        border: 2px solid #ffffff;
                        box-shadow: none;
                    }

                    .slider::-webkit-slider-track {
                        height: 4px;
                        background: #4b5563;
                        border-radius: 2px;
                    }

                    .slider::-moz-range-track {
                        height: 4px;
                        background: #4b5563;
                        border-radius: 2px;
                        border: none;
                    }

                    .line-clamp-2 {
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                `
            }} />

            {/* Header */}
            <header className="bg-gray-800 p-4 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h1
                            className="text-2xl font-bold text-blue-400 cursor-pointer hover:text-blue-300 transition-colors"
                            onClick={() => navigate('/')}
                        >
                            VideoStream Pro
                        </h1>
                        {currentPath !== '/' && (
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                            >
                                <ArrowLeft size={20} />
                                Back to Home
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <Router currentPath={currentPath}>
                <Route path="/">
                    <HomePage navigate={navigate} />
                </Route>
                <Route path="/watch">
                    <VideoPlayerPage videoId={selectedVideoId} navigate={navigate} />
                </Route>
            </Router>
        </div>
    );
};

// Home Page Component
const HomePage = ({ navigate }) => {
    const [videos, setVideos] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const fileInputRef = useRef(null);

    const API_BASE = 'http://localhost:5000/api';

    useEffect(() => {
        fetchVideos();
        const interval = setInterval(fetchVideos, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchVideos = async () => {
        try {
            const response = await fetch(`${API_BASE}/videos`);
            const data = await response.json();
            setVideos(data);
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('video', file);
        formData.append('title', file.name.split('.')[0]);

        try {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const progress = (e.loaded / e.total) * 100;
                    setUploadProgress(Math.round(progress));
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    setUploadProgress(100);
                    fetchVideos();
                    setTimeout(() => {
                        setIsUploading(false);
                        setUploadProgress(0);
                    }, 1000);
                } else {
                    throw new Error('Upload failed');
                }
            });

            xhr.addEventListener('error', () => {
                setIsUploading(false);
                setUploadProgress(0);
                alert('Upload failed');
            });

            xhr.open('POST', `${API_BASE}/upload`);
            xhr.send(formData);

        } catch (error) {
            console.error('Upload error:', error);
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getFilteredAndSortedVideos = () => {
        let filtered = videos.filter(video =>
            video.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        switch (sortBy) {
            case 'newest':
                return filtered.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
            case 'oldest':
                return filtered.sort((a, b) => new Date(a.upload_date) - new Date(b.upload_date));
            case 'title':
                return filtered.sort((a, b) => a.title.localeCompare(b.title));
            case 'duration':
                return filtered.sort((a, b) => b.duration - a.duration);
            default:
                return filtered;
        }
    };

    const handleVideoClick = (video) => {
        if (video.status === 'ready') {
            navigate('/watch', video.id);
        }
    };

    return (
        <div className="container mx-auto p-6">
            {/* Upload Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Share Your Videos</h2>
                    <p className="text-blue-100 mb-6">Upload and stream your videos with multiple quality options</p>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="video/*"
                        className="hidden"
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Upload className="inline mr-2" size={20} />
                        {isUploading ? `Uploading ${uploadProgress}%` : 'Upload New Video'}
                    </button>

                    {isUploading && (
                        <div className="mt-6 max-w-md mx-auto">
                            <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-white h-full transition-all duration-300 rounded-full"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-white/80 text-sm mt-2">{uploadProgress}% uploaded</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search videos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    />
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title A-Z</option>
                    <option value="duration">Longest First</option>
                </select>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getFilteredAndSortedVideos().map(video => (
                    <div
                        key={video.id}
                        onClick={() => handleVideoClick(video)}
                        className={`bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-200 transform hover:scale-105 ${
                            video.status === 'ready' ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'
                        }`}
                    >
                        {/* Thumbnail */}
                        <div className="relative aspect-video bg-gray-700">
                            {video.thumbnail ? (
                                <img
                                    src={`http://localhost:5000/uploads/${video.thumbnail}`}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Play size={32} className="text-gray-400" />
                                </div>
                            )}

                            {/* Duration Badge */}
                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                {formatTime(video.duration)}
                            </div>

                            {/* Status Badge */}
                            <div className="absolute top-2 left-2">
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                    video.status === 'ready' ? 'bg-green-600 text-white' :
                                        video.status === 'processing' ? 'bg-yellow-600 text-black' :
                                            video.status === 'error' ? 'bg-red-600 text-white' : 'bg-gray-600 text-white'
                                }`}>
                                    {video.status}
                                </span>
                            </div>

                            {/* Play Overlay */}
                            {video.status === 'ready' && (
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-200">
                                    <div className="bg-blue-600 rounded-full p-3">
                                        <Play size={24} className="text-white" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Video Info */}
                        <div className="p-4">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2" title={video.title}>
                                {video.title}
                            </h3>

                            <div className="flex items-center justify-between text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Clock size={14} />
                                    <span>{formatDate(video.upload_date)}</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <Eye size={14} />
                                    <span>{Math.floor(video.duration / 60)}m</span>
                                </div>
                            </div>

                            {video.status === 'processing' && (
                                <div className="mt-3">
                                    <div className="bg-gray-700 rounded-full h-1 overflow-hidden">
                                        <div className="bg-yellow-500 h-full w-1/2 animate-pulse"/>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Processing video...</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {videos.length === 0 && (
                <div className="text-center py-16">
                    <div className="text-gray-400 mb-4">
                        <Upload size={64} className="mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-2">No videos uploaded yet</h3>
                        <p className="text-lg">Upload your first video to get started with VideoStream Pro</p>
                    </div>
                </div>
            )}

            {/* No Results */}
            {videos.length > 0 && getFilteredAndSortedVideos().length === 0 && (
                <div className="text-center py-16">
                    <div className="text-gray-400">
                        <h3 className="text-xl font-semibold mb-2">No videos found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// Video Player Page Component
const VideoPlayerPage = ({ videoId, navigate }) => {
    const [video, setVideo] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [resolution, setResolution] = useState('720p');
    const [availableResolutions, setAvailableResolutions] = useState([]);
    const [loadedChunks, setLoadedChunks] = useState([]);
    const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [relatedVideos, setRelatedVideos] = useState([]);

    const videoRef = useRef(null);
    const controlsTimeoutRef = useRef(null);
    const playerContainerRef = useRef(null);

    const API_BASE = 'http://localhost:5000/api';

    useEffect(() => {
        if (videoId) {
            fetchVideoDetails();
            fetchRelatedVideos();
        }
    }, [videoId]);

    useEffect(() => {
        if (video) {
            initializeVideo();
        }
    }, [video, resolution]);

    const fetchVideoDetails = async () => {
        try {
            const response = await fetch(`${API_BASE}/videos/${videoId}`);
            const videoData = await response.json();
            setVideo(videoData);
            setDuration(videoData.duration);
        } catch (error) {
            console.error('Error fetching video details:', error);
        }
    };

    const fetchRelatedVideos = async () => {
        try {
            const response = await fetch(`${API_BASE}/videos`);
            const allVideos = await response.json();
            const related = allVideos
                .filter(v => v.id !== parseInt(videoId) && v.status === 'ready')
                .slice(0, 8);
            setRelatedVideos(related);
        } catch (error) {
            console.error('Error fetching related videos:', error);
        }
    };

    const initializeVideo = async () => {
        if (!video) return;

        try {
            const resResponse = await fetch(`${API_BASE}/videos/${video.id}/resolutions`);
            const resolutions = await resResponse.json();
            setAvailableResolutions(resolutions);

            await loadVideoChunks(0, 10);
            setCurrentTime(0);
            setCurrentChunkIndex(0);
        } catch (error) {
            console.error('Error initializing video:', error);
        }
    };

    const loadVideoChunks = async (offset = 0, limit = 10) => {
        if (!video) return;

        try {
            const response = await fetch(
                `${API_BASE}/videos/${video.id}/chunks?resolution=${resolution}&offset=${offset}&limit=${limit}`
            );
            const chunks = await response.json();

            if (offset === 0) {
                setLoadedChunks(chunks);
            } else {
                setLoadedChunks(prev => [...prev, ...chunks]);
            }

            return chunks;
        } catch (error) {
            console.error('Error loading chunks:', error);
            return [];
        }
    };

    const playChunk = async (chunkIndex) => {
        if (!video || !loadedChunks[chunkIndex]) return;

        try {
            // Use the filename from the API response instead of constructing the URL
            const chunk = loadedChunks[chunkIndex];
            const chunkUrl = `${API_BASE}/videos/${video.id}/chunk/${chunk.chunk_number}?resolution=${resolution}`;

            if (videoRef.current) {
                videoRef.current.src = chunkUrl;
                videoRef.current.volume = volume;
                videoRef.current.playbackRate = playbackSpeed;

                if (isPlaying) {
                    await videoRef.current.play();
                }
            }
        } catch (error) {
            console.error('Error playing chunk:', error);
        }
    };

    const handlePlayPause = async () => {
        if (!videoRef.current || !video) return;

        try {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                if (!loadedChunks[currentChunkIndex] || !videoRef.current.src) {
                    await playChunk(currentChunkIndex);
                }
                await videoRef.current.play();
                setIsPlaying(true);
            }
        } catch (error) {
            console.error('Error toggling play/pause:', error);
        }
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current || !video || !loadedChunks[currentChunkIndex]) return;

        const videoElement = videoRef.current;
        const currentChunk = loadedChunks[currentChunkIndex];
        const chunkStartTime = currentChunk.start_time || 0;
        const actualTime = chunkStartTime + videoElement.currentTime;
        setCurrentTime(actualTime);

        const chunkEndTime = currentChunk.end_time || 0;
        if (actualTime >= chunkEndTime - 1 && currentChunkIndex < loadedChunks.length - 1) {
            handleNextChunk();
        }
    };

    const handleNextChunk = async () => {
        if (currentChunkIndex < loadedChunks.length - 1) {
            const nextIndex = currentChunkIndex + 1;
            setCurrentChunkIndex(nextIndex);
            await playChunk(nextIndex);
        } else {
            // Load more chunks if available
            const newChunks = await loadVideoChunks(loadedChunks.length, 5);
            if (newChunks.length > 0) {
                const nextIndex = currentChunkIndex + 1;
                setCurrentChunkIndex(nextIndex);
                await playChunk(nextIndex);
            } else {
                // End of video
                setIsPlaying(false);
            }
        }
    };

    const handleSeek = async (seekTime) => {
        if (!video || !loadedChunks.length) return;

        const targetChunk = loadedChunks.find(chunk =>
            seekTime >= chunk.start_time && seekTime < chunk.end_time
        );

        if (targetChunk) {
            const chunkIndex = loadedChunks.indexOf(targetChunk);
            const chunkSeekTime = seekTime - targetChunk.start_time;

            setCurrentChunkIndex(chunkIndex);
            await playChunk(chunkIndex);

            if (videoRef.current) {
                videoRef.current.currentTime = chunkSeekTime;
            }
            setCurrentTime(seekTime);
        }
    };

    const handleResolutionChange = (newResolution) => {
        setResolution(newResolution);
        setLoadedChunks([]);
        setCurrentChunkIndex(0);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            playerContainerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying && !isFullscreen) setShowControls(false);
        }, 3000);
    };

    if (!video) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p>Loading video...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Video Player */}
                <div className="lg:col-span-3">
                    <div
                        ref={playerContainerRef}
                        className="relative bg-black rounded-lg overflow-hidden"
                    >
                        <div
                            className="relative group"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={() => isPlaying && !isFullscreen && setShowControls(false)}
                        >
                            <video
                                ref={videoRef}
                                className="w-full aspect-video"
                                onTimeUpdate={handleTimeUpdate}
                                onLoadedMetadata={() => {
                                    if (videoRef.current) {
                                        videoRef.current.volume = volume;
                                        videoRef.current.playbackRate = playbackSpeed;
                                    }
                                }}
                                onEnded={handleNextChunk}
                                onClick={handlePlayPause}
                            />

                            {/* Video Controls Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                                {/* Play/Pause Button (Center) */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button
                                        onClick={handlePlayPause}
                                        className="bg-white/20 hover:bg-white/30 rounded-full p-4 transition-all duration-200 backdrop-blur-sm"
                                    >
                                        {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                                    </button>
                                </div>

                                {/* Bottom Controls */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <input
                                            type="range"
                                            min="0"
                                            max={duration}
                                            value={currentTime}
                                            onChange={(e) => handleSeek(parseFloat(e.target.value))}
                                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={handlePlayPause}
                                                className="hover:text-blue-400 transition-colors"
                                            >
                                                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                                            </button>

                                            <div className="flex items-center gap-2">
                                                <Volume2 size={20} />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.1"
                                                    value={volume}
                                                    onChange={(e) => {
                                                        const newVolume = parseFloat(e.target.value);
                                                        setVolume(newVolume);
                                                        if (videoRef.current) {
                                                            videoRef.current.volume = newVolume;
                                                        }
                                                    }}
                                                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                                                />
                                            </div>

                                            <span className="text-sm">
                                                {formatTime(currentTime)} / {formatTime(duration)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <select
                                                value={playbackSpeed}
                                                onChange={(e) => {
                                                    const speed = parseFloat(e.target.value);
                                                    setPlaybackSpeed(speed);
                                                    if (videoRef.current) {
                                                        videoRef.current.playbackRate = speed;
                                                    }
                                                }}
                                                className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
                                            >
                                                <option value={0.5}>0.5x</option>
                                                <option value={0.75}>0.75x</option>
                                                <option value={1}>1x</option>
                                                <option value={1.25}>1.25x</option>
                                                <option value={1.5}>1.5x</option>
                                                <option value={2}>2x</option>
                                            </select>

                                            <select
                                                value={resolution}
                                                onChange={(e) => handleResolutionChange(e.target.value)}
                                                className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
                                            >
                                                {availableResolutions.map(res => (
                                                    <option key={res} value={res}>{res}</option>
                                                ))}
                                            </select>

                                            <button
                                                onClick={toggleFullscreen}
                                                className="hover:text-blue-400 transition-colors"
                                            >
                                                <Maximize size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Video Info */}
                        <div className="p-6 bg-gray-800">
                            <h1 className="text-2xl font-bold mb-3">{video.title}</h1>
                            <div className="flex items-center gap-6 text-sm text-gray-400">
                                <span>Duration: {formatTime(video.duration)}</span>
                                <span>Resolution: {resolution}</span>
                                <span>Uploaded: {new Date(video.upload_date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Videos Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-800 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-4">Related Videos</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {relatedVideos.map(relatedVideo => (
                                <div
                                    key={relatedVideo.id}
                                    onClick={() => navigate('/watch', relatedVideo.id)}
                                    className="p-3 rounded-lg cursor-pointer transition-all duration-200 bg-gray-700 hover:bg-gray-600"
                                >
                                    <div className="flex items-start gap-3">
                                        {relatedVideo.thumbnail ? (
                                            <img
                                                src={`http://localhost:5000/uploads/${relatedVideo.thumbnail}`}
                                                alt={relatedVideo.title}
                                                className="w-16 h-12 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-16 h-12 bg-gray-600 rounded flex items-center justify-center">
                                                <Play size={16} />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm truncate">{relatedVideo.title}</h4>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {formatTime(relatedVideo.duration)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {relatedVideos.length === 0 && (
                                <div className="text-center text-gray-400 py-8">
                                    <p>No related videos</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for sliders */}
            <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: none;
        }

        .slider::-webkit-slider-track {
          height: 4px;
          background: #4b5563;
          border-radius: 2px;
        }

        .slider::-moz-range-track {
          height: 4px;
          background: #4b5563;
          border-radius: 2px;
          border: none;
        }

        .line-clamp-2 {
          di/splay: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
};

export default VideoStreamingPlatform;