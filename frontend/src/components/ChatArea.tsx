import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Video, HelpCircle, AlertCircle, Menu, Plus } from 'lucide-react';
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
  onToggleSidebar?: () => void;
  onNewChat?: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  prompts,
  isGenerating,
  onSubmitPrompt,
  convoTitle,
  onToggleSidebar,
  onNewChat,
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

  // Welcome Dashboard (when no conversation is active)
  if (!convoTitle) {
    return (
      <div className="flex flex-1 flex-col bg-[#00111c] overflow-y-auto relative h-screen">
        {/* Mobile top bar to access sidebar drawer */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#002e4e] bg-[#001a2c]/80 px-4 sm:px-6 backdrop-blur-md z-10 md:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#002e4e] bg-[#00111c] text-slate-300 hover:text-white hover:bg-[#00253e] transition-colors"
              title="Open Conversation Menu"
              aria-label="Open Conversation Menu"
            >
              <Menu className="h-5 w-5 text-[#38bdf8]" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00406c] border border-[#005a96]">
                <Video className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight text-white font-outfit">
                Animo<span className="text-[#38bdf8]">Concepto</span>
              </span>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col justify-center">
          <QuickTemplates onSelectPrompt={onSubmitPrompt} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-[#00111c] text-white overflow-hidden relative h-screen">
      {/* Background glow flares */}
      <div className="absolute top-10 right-20 h-64 w-64 rounded-full bg-[#00406c]/10 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-40 left-10 h-64 w-64 rounded-full bg-[#002e4e]/15 blur-[90px] pointer-events-none" />

      {/* Header bar */}
      <header className="flex h-14 sm:h-16 shrink-0 items-center justify-between border-b border-[#002e4e] bg-[#001a2c]/80 px-4 sm:px-6 backdrop-blur-md z-10">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Mobile hamburger menu button */}
          <button
            onClick={onToggleSidebar}
            className="flex md:hidden h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg border border-[#002e4e] bg-[#00111c] text-slate-300 hover:text-white hover:bg-[#00253e] transition-colors mr-1"
            title="Open Conversations Menu"
            aria-label="Open Conversations Menu"
          >
            <Menu className="h-4.5 w-4.5 text-[#38bdf8]" />
          </button>

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00111c] border border-[#002e4e]">
            <Video className="h-4.5 w-4.5 text-[#38bdf8]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold font-outfit truncate max-w-[200px] sm:max-w-md">{convoTitle}</h2>
            <p className="text-[9px] sm:text-[10px] text-slate-500 font-semibold tracking-wide uppercase truncate">Video Generation Channel</p>
          </div>
        </div>

        {onNewChat && (
          <button
            onClick={onNewChat}
            className="flex items-center gap-1.5 rounded-lg border border-[#00406c] bg-[#00253e] px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-sky-300 hover:bg-[#003354] hover:text-white transition-colors"
            title="Start New Animation"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        )}
      </header>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4 z-10 scrollbar-thin">
        {prompts.length === 0 && !isGenerating ? (
          <div className="flex h-full flex-col items-center justify-center text-center opacity-70 px-4">
            <Sparkles className="h-8 w-8 sm:h-9 sm:w-9 text-[#38bdf8] animate-pulse mb-2.5" />
            <p className="text-sm font-medium text-slate-300">Ready to create animations</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Type a concept like <code className="text-[#38bdf8] bg-[#00253e] px-1.5 py-0.5 rounded border border-[#002e4e]">create a video to explain llms</code> below.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
            {prompts.map((item) => {
              const isUser = item.role === 'user';
              return (
                <div key={item.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1.5 w-full`}>
                  {isUser ? (
                    // User text bubble
                    <div className="bg-[#00406c] text-white border border-[#005a96] rounded-2xl rounded-tr-sm px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm max-w-[85%] sm:max-w-[75%] shadow-lg font-medium leading-relaxed select-text ml-auto break-words">
                      {item.prompt}
                    </div>
                  ) : item.isError ? (
                    // Error message card
                    <div className="w-full max-w-[540px] sm:max-w-[560px] rounded-xl border border-rose-500/20 bg-rose-950/10 p-3.5 sm:p-4 text-rose-400 flex flex-col gap-2 shadow-lg">
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm font-outfit">
                        <AlertCircle className="h-4.5 w-4.5 text-rose-400 shrink-0" />
                        <span>error generating video</span>
                      </div>
                    </div>
                  ) : (
                    // Assistant response card containing player
                    <div className="w-full flex flex-col items-start">
                      <CustomVideoPlayer promptId={item.id} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading skeleton placeholder */}
            {isGenerating && (
              <div className="flex flex-col items-start gap-2 w-full">
                <SkeletonLoader />
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input panel bar */}
      <footer className="border-t border-[#002e4e] bg-[#001a2c]/80 p-2.5 sm:p-3 shrink-0 z-10 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
              rows={1}
              placeholder={isGenerating ? "Generating animation video..." : "Explain a mathematical concept or prompt scene generation..."}
              className="w-full resize-none rounded-xl border border-[#002e4e] bg-[#00111c] py-2.5 sm:py-3 pr-10 sm:pr-12 pl-3.5 sm:pl-4 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-[#00406c] focus:ring-1 focus:ring-[#00406c] disabled:opacity-50 min-h-[44px] sm:min-h-[48px] max-h-[120px] scrollbar-thin"
              style={{ height: 'auto' }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-[#00406c] border border-[#005a96] text-white shadow-lg shadow-[#00406c]/30 transition-all duration-300 hover:bg-[#005a96] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send prompt"
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </form>
        <div className="max-w-3xl mx-auto flex items-center gap-1.5 mt-1 sm:mt-1.5 justify-center text-[9px] sm:text-[10px] text-slate-500 font-semibold tracking-wider uppercase text-center">
          <HelpCircle className="h-3 w-3 text-slate-600 shrink-0 hidden sm:inline" />
          <span>Press Enter to send. Shift + Enter for new line.</span>
        </div>
      </footer>
    </div>
  );
};
