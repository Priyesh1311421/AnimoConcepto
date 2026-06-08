import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Video, LogOut, MessageSquare } from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

interface SidebarProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
  onLogout,
}) => {
  return (
    <aside className="flex h-screen w-80 flex-col border-r border-white/10 bg-[#0f0f1c] text-white">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-white/5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-md shadow-brand-500/20">
          <Video className="h-5 w-5 text-white" />
        </div>
        <span className="bg-gradient-to-r from-white to-brand-400 bg-clip-text text-xl font-bold tracking-tight text-transparent font-outfit">
          AnimoConcepto
        </span>
      </div>

      {/* New Animation Button */}
      <div className="p-4">
        <motion.button
          whileHover={{ scale: 1.02, border: '1px solid rgba(139, 92, 246, 0.4)' }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreate}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] py-3 text-sm font-semibold transition-all duration-300 hover:bg-white/[0.05]"
        >
          <Plus className="h-4 w-4 text-brand-400" />
          <span>New Video Chat</span>
        </motion.button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin">
        {conversations.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-center px-4">
            <MessageSquare className="h-8 w-8 text-slate-600 mb-2" />
            <p className="text-xs text-slate-500">No conversations yet.</p>
            <p className="text-[10px] text-slate-600 mt-1">Start a new video generator chat.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {conversations.map((convo) => {
              const isActive = convo.id === selectedId;
              return (
                <motion.div
                  key={convo.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="group relative"
                >
                  <button
                    onClick={() => onSelect(convo.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-600/30 to-indigo-500/10 border border-brand-500/30 text-white font-medium shadow-inner'
                        : 'border border-transparent text-slate-400 hover:bg-white/[0.03] hover:text-white'
                    }`}
                  >
                    <MessageSquare className={`h-4 w-4 shrink-0 ${isActive ? 'text-brand-400' : 'text-slate-500'}`} />
                    <span className="truncate pr-8">{convo.title}</span>
                  </button>

                  {/* Delete button (reveals on hover) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(convo.id);
                    }}
                    className="absolute top-1/2 right-3 h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md border border-white/5 bg-[#17172a] text-slate-500 opacity-0 transition-all duration-300 hover:border-rose-500/40 hover:text-rose-400 hover:shadow-lg hover:shadow-rose-950/20 group-hover:opacity-100 flex"
                    title="Delete Conversation"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* User Session Footer */}
      <div className="border-t border-white/5 bg-black/10 p-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-slate-400 transition-colors duration-300 hover:bg-white/[0.03] hover:text-white"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-700 to-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase">
              U
            </div>
            <span className="text-xs font-semibold tracking-wide">User Account</span>
          </div>
          <LogOut className="h-4.5 w-4.5 shrink-0" />
        </button>
      </div>
    </aside>
  );
};
