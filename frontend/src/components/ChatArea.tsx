import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Video, HelpCircle, AlertCircle } from 'lucide-react';
import { QuickTemplates } from './QuickTemplates';
import { SkeletonLoader } from './SkeletonLoader';
import { CustomVideoPlayer } from './CustomVideoPlayer';

interface PromptItem {
  id: string;
  prompt: string;
  video_url: string;
  created_at: string;
  role?: 'user' | 'assistant';
  isError?: boolean;
}

interface ChatAreaProps {
  prompts: PromptItem[];
  isGenerating: boolean;
  onSubmitPrompt: (prompt: string) => void;
  convoTitle: string | null;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  prompts,
  isGenerating,
  onSubmitPrompt,
  convoTitle,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [prompts, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    onSubmitPrompt(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Welcome Dashboard
  if (!convoTitle) {
    return (
      <div className="flex flex-1 flex-col bg-[#0b0b14] overflow-y-auto">
        <QuickTemplates onSelectPrompt={onSubmitPrompt} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-[#0b0b14] text-white overflow-hidden relative">
      {/* Background glow flares */}
      <div className="absolute top-10 right-20 h-64 w-64 rounded-full bg-brand-500/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-40 left-10 h-64 w-64 rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />

      {/* Header bar */}
      <header className="flex h-16 shrink-0 items-center border-b border-white/5 bg-[#0f0f1c]/70 px-6 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] border border-white/5">
            <Video className="h-4.5 w-4.5 text-brand-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-outfit truncate max-w-md">{convoTitle}</h2>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wide">VIDEO GENERATION CHANNEL</p>
          </div>
        </div>
      </header>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 z-10 scrollbar-thin">
        {prompts.length === 0 && !isGenerating ? (
          <div className="flex h-full flex-col items-center justify-center text-center opacity-70">
            <Sparkles className="h-10 w-10 text-brand-400 animate-pulse mb-3" />
            <p className="text-sm font-medium text-slate-300">Ready to create animations</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Type a concept like <code className="text-brand-300 bg-white/5 px-1.5 py-0.5 rounded">create a video to explain llms</code> below.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {prompts.map((item) => {
              const isUser = item.role === 'user';
              return (
                <div key={item.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-2 w-full`}>
                  {isUser ? (
                    // User text bubble
                    <div className="bg-brand-600/90 text-white rounded-2xl rounded-tr-sm px-4.5 py-3 text-sm max-w-[80%] shadow-lg shadow-brand-950/20 font-medium leading-relaxed select-text ml-auto">
                      {item.prompt}
                    </div>
                  ) : item.isError ? (
                    // Beautiful error message card
                    <div className="w-full max-w-2xl rounded-xl border border-rose-500/20 bg-rose-950/10 p-5 text-rose-400 flex flex-col gap-2 shadow-lg">
                      <div className="flex items-center gap-2 font-bold text-sm font-outfit">
                        <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
                        <span>error generating video</span>
                      </div>
                    </div>
                  ) : (
                    // Assistant response card containing player
                    <div className="space-y-3.5 w-full flex flex-col items-start">
                      <CustomVideoPlayer promptId={item.id} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading skeleton placeholder */}
            {isGenerating && (
              <div className="flex flex-col items-start gap-2">
                <SkeletonLoader />
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input panel bar */}
      <footer className="border-t border-white/5 bg-[#0f0f1c]/50 p-4 shrink-0 z-10 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center gap-3">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
              rows={1}
              placeholder={isGenerating ? "Generating animation video..." : "Explain a mathematical concept or prompt scene generation..."}
              className="w-full resize-none rounded-xl border border-white/10 bg-black/30 py-3.5 pr-12 pl-4 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50 min-h-[50px] max-h-[150px] scrollbar-thin"
              style={{ height: 'auto' }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-indigo-500 text-white shadow-lg shadow-brand-500/20 transition-all duration-300 hover:shadow-brand-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4.5 w-4.5" />
          </motion.button>
        </form>
        <div className="max-w-4xl mx-auto flex items-center gap-1.5 mt-2 justify-center text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
          <HelpCircle className="h-3 w-3 text-slate-600" />
          <span>Press Enter to send prompt. Multi-line is Shift + Enter.</span>
        </div>
      </footer>
    </div>
  );
};
