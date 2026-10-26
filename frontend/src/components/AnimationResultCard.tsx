import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquarePlus, Check, Share2 } from 'lucide-react';
import { CustomVideoPlayer } from './CustomVideoPlayer';

interface AnimationResultCardProps {
  promptId: string;
  userPromptText?: string;
  createdAt?: string;
  onRefine?: (promptText: string) => void;
}

export const AnimationResultCard: React.FC<AnimationResultCardProps> = ({
  promptId,
  userPromptText,
  createdAt,
  onRefine,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const formatTimestamp = (iso?: string) => {
    if (!iso) return '';
    try {
      const date = new Date(iso);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AnimoConcepto Animation',
          text: userPromptText ? `Check out this animation of: ${userPromptText}` : 'Check out this animated video',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch {
      // User cancelled or clipboard fallback
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0d1017] p-4 sm:p-5 shadow-2xl backdrop-blur-md space-y-4"
    >
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-1 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white font-outfit tracking-wide">
                Generated Animation
              </span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                Ready
              </span>
            </div>
            {createdAt && (
              <span className="text-[10px] text-slate-500 font-mono">
                {formatTimestamp(createdAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div>
        <CustomVideoPlayer promptId={promptId} />
      </div>

      {/* Card Footer Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
        {userPromptText ? (
          <div className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
            <span className="text-slate-500 font-medium">Prompt:</span>{' '}
            <span className="italic text-slate-300">"{userPromptText}"</span>
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          {onRefine && userPromptText && (
            <button
              onClick={() => onRefine(`Refine the animation for "${userPromptText}": `)}
              className="flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-400 hover:bg-sky-500/20 transition-colors"
              title="Refine this animation"
            >
              <MessageSquarePlus className="h-3.5 w-3.5" />
              <span>Refine</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            title="Share animation link"
          >
            {copiedLink ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
