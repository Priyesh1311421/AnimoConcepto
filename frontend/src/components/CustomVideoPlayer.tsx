import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2, Download, Loader2, RefreshCw } from 'lucide-react';
import { api } from '../utils/api';

interface CustomVideoPlayerProps {
  promptId: string;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ promptId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Fetch the video file as an authenticated blob
  useEffect(() => {
    let active = true;
    const loadVideo = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = await api.fetchVideoBlob(promptId);
        if (active) {
          setVideoUrl(url);
          setLoading(false);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Error loading video player');
          setLoading(false);
        }
      }
    };

    loadVideo();

    return () => {
      active = false;
      // Clean up object URL when component unmounts to prevent leaks
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [promptId]);

  // Handle auto-hide controls
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowControls(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [showControls, isPlaying]);

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
    }
    setIsMuted(newVol === 0);
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTime = parseFloat(e.target.value);
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="aspect-video w-full max-w-2xl rounded-xl border border-white/5 bg-slate-950/60 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-brand-400 animate-spin" />
        <span className="text-xs text-slate-400 font-medium">Loading video file...</span>
      </div>
    );
  }

  if (error || !videoUrl) {
    return (
      <div className="aspect-video w-full max-w-2xl rounded-xl border border-rose-500/20 bg-rose-950/10 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <span className="text-sm font-semibold text-rose-400">Failed to render video</span>
        <span className="text-xs text-rose-500 max-w-xs">{error || 'An unexpected error occurred.'}</span>
        <button
          onClick={() => {
            setLoading(true);
            setError(null);
            api.fetchVideoBlob(promptId)
              .then(url => {
                setVideoUrl(url);
                setLoading(false);
              })
              .catch(err => {
                setError(err.message || 'Error loading video player');
                setLoading(false);
              });
          }}
          className="mt-2 flex items-center gap-1.5 rounded-lg bg-rose-500/20 px-3.5 py-1.5 text-xs text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reload Player</span>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="group relative aspect-video w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-black shadow-xl"
    >
      <video
        ref={videoRef}
        src={videoUrl}
        onClick={handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        className="h-full w-full object-contain cursor-pointer"
        playsInline
      />

      {/* Big Center Play Overlay (when paused) */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/90 text-white shadow-lg shadow-brand-500/20 hover:scale-110 transition-transform duration-300">
              <Play className="h-7 w-7 fill-white translate-x-0.5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Controls Bar */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pt-10 flex flex-col gap-3.5"
          >
            {/* Timeline track slider */}
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand-500 hover:h-1.5 transition-all outline-none"
              />
            </div>

            {/* Navigation and buttons */}
            <div className="flex items-center justify-between text-white select-none">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePlayPause}
                  className="rounded-lg p-1 hover:bg-white/10 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 fill-white" />
                  ) : (
                    <Play className="h-5 w-5 fill-white" />
                  )}
                </button>

                {/* Volume selector */}
                <div className="flex items-center gap-2 group/volume">
                  <button
                    onClick={handleToggleMute}
                    className="rounded-lg p-1 hover:bg-white/10 transition-colors"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-0 opacity-0 group-hover/volume:w-16 group-hover/volume:opacity-100 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white transition-all outline-none"
                  />
                </div>

                {/* Duration tracker */}
                <span className="text-xs font-mono text-slate-300">
                  {formatTime(currentTime)} <span className="opacity-40">/</span> {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Download video */}
                <a
                  href={videoUrl}
                  download={`manim_animation_${promptId}.mp4`}
                  className="rounded-lg p-1 hover:bg-white/10 transition-colors flex items-center justify-center"
                  title="Download MP4"
                >
                  <Download className="h-4.5 w-4.5" />
                </a>

                {/* Go Fullscreen */}
                <button
                  onClick={handleToggleFullscreen}
                  className="rounded-lg p-1 hover:bg-white/10 transition-colors"
                  title="Fullscreen"
                >
                  <Maximize2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
