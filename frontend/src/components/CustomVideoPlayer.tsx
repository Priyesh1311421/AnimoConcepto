import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Maximize2, Download, Loader2, RotateCcw } from 'lucide-react';
import { api } from '../utils/api';

interface CustomVideoPlayerProps {
  promptId: string;
  onLoaded?: () => void;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ promptId, onLoaded }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const blobUrlRef = useRef<string | null>(null);
  const onLoadedRef = useRef(onLoaded);

  useEffect(() => {
    onLoadedRef.current = onLoaded;
  }, [onLoaded]);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Load video blob only when promptId changes
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const url = await api.fetchVideoBlob(promptId);
        if (isCancelled) {
          URL.revokeObjectURL(url);
          return;
        }

        // Clean up previous blob URL if any
        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current);
        }

        blobUrlRef.current = url;
        setVideoUrl(url);
        setLoading(false);
        onLoadedRef.current?.();
      } catch (err: unknown) {
        if (!isCancelled) {
          setError((err as Error).message || 'Error loading video file');
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isCancelled = true;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [promptId]); // STRICTLY depends only on promptId to prevent infinite loop and flickering!

  // Auto-hide controls during playback
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      return;
    }

    const timer = setTimeout(() => {
      if (!isHovered) {
        setShowControls(false);
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [isPlaying, isHovered]);

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
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    api.fetchVideoBlob(promptId)
      .then((url) => {
        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current);
        }
        blobUrlRef.current = url;
        setVideoUrl(url);
        setLoading(false);
        onLoaded?.();
      })
      .catch((err: unknown) => {
        setError((err as Error).message || 'Error loading video file');
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="aspect-video w-full max-w-[540px] sm:max-w-[560px] rounded-xl border border-white/10 bg-[#0d1017] flex flex-col items-center justify-center gap-3">
        <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20 shadow-lg shadow-sky-500/5">
          <Loader2 className="h-5 w-5 text-sky-400 animate-spin" />
        </div>
        <span className="text-xs text-slate-400 font-medium tracking-wide">Loading animation video...</span>
      </div>
    );
  }

  if (error || !videoUrl) {
    return (
      <div className="aspect-video w-full max-w-[540px] sm:max-w-[560px] rounded-xl border border-rose-500/20 bg-rose-950/15 flex flex-col items-center justify-center gap-3 p-5 sm:p-6 text-center">
        <div className="h-9 w-9 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <RotateCcw className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-rose-300">Video Player Unavailable</h4>
          <p className="text-xs text-rose-400/80 mt-1 max-w-sm">{error || 'Unable to load MP4 stream.'}</p>
        </div>
        <button
          onClick={handleRetry}
          className="mt-1 flex items-center gap-1.5 rounded-lg bg-rose-500/20 px-3.5 py-1.5 text-xs font-semibold text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        setIsHovered(true);
        setShowControls(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (isPlaying) setShowControls(false);
      }}
      onMouseMove={() => setShowControls(true)}
      className="group relative aspect-video w-full max-w-[540px] sm:max-w-[560px] overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl focus-within:ring-2 focus-within:ring-sky-500/50"
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

      {/* Center Play Overlay (when paused) */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center bg-black/35 cursor-pointer backdrop-blur-[1px]"
          >
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-sky-500 text-white shadow-xl shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all duration-200">
              <Play className="h-6 w-6 sm:h-7 sm:w-7 fill-white translate-x-0.5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Bottom Controls Bar */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 sm:p-4 pt-8 flex flex-col gap-2.5 z-20"
          >
            {/* Timeline Progress Slider */}
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.01}
                value={currentTime}
                onChange={handleSeek}
                aria-label="Video timeline seek"
                className="w-full h-1 sm:h-1.5 bg-white/25 rounded-full appearance-none cursor-pointer accent-sky-400 hover:h-2 transition-all outline-none"
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between text-white select-none gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handlePlayPause}
                  className="rounded-lg p-1.5 hover:bg-white/10 active:bg-white/20 transition-colors text-white focus-visible:ring-1 focus-visible:ring-sky-400"
                  aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 sm:h-5 sm:w-5 fill-white" />
                  ) : (
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-white" />
                  )}
                </button>

                {/* Time Display */}
                <span className="text-[11px] sm:text-xs font-mono text-slate-300 tracking-wider">
                  {formatTime(currentTime)} <span className="text-slate-500">/</span> {formatTime(duration)}
                </span>
              </div>

              {/* Action Buttons: Fullscreen & Download */}
              <div className="flex items-center gap-1 sm:gap-2">
                <a
                  href={videoUrl}
                  download={`animation_${promptId}.mp4`}
                  className="rounded-lg p-1.5 text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors flex items-center justify-center"
                  title="Download MP4"
                  aria-label="Download MP4 video"
                >
                  <Download className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </a>

                <button
                  onClick={handleToggleFullscreen}
                  className="rounded-lg p-1.5 text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors"
                  title="Toggle Fullscreen"
                  aria-label="Toggle Fullscreen"
                >
                  <Maximize2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
