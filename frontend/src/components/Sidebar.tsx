import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Video,
  LogOut,
  MessageSquare,
  ArrowLeft,
  X,
  Search,
} from 'lucide-react';

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
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
  onLogout,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const formatRelativeTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const now = new Date();
      const past = new Date(isoString);
      const diffMs = now.getTime() - past.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return past.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter((c) => c.title.toLowerCase().includes(q));
  }, [conversations, searchQuery]);

  const handleSelectConvo = (id: string) => {
    onSelect(id);
    onCloseMobile?.();
  };

  const handleCreateNew = () => {
    onCreate();
    onCloseMobile?.();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirmDeleteId === id) {
      onDelete(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
    }
  };

  const renderContent = (isMobileView: boolean = false) => (
    <div className="flex h-full w-full flex-col bg-[#0d1017]">
      {/* Brand Header */}
      <div className="flex h-14 shrink-0 items-center justify-between px-4 border-b border-white/10">
        <button
          onClick={() => {
            navigate('/');
            if (isMobileView) onCloseMobile?.();
          }}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          title="Back to Landing Page"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-sky-400" />
          <span>Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 shadow-sm">
            <Video className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white font-outfit">
            Animo<span className="text-sky-400">Concepto</span>
          </span>
        </div>

        {isMobileView && (
          <button
            onClick={onCloseMobile}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* New Project Button */}
      <div className="p-3 shrink-0">
        <button
          onClick={handleCreateNew}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-sky-500 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/20 active:scale-98"
        >
          <Plus className="h-4 w-4 text-sky-400 group-hover:text-white" />
          <span>New Animation Studio</span>
        </button>
      </div>

      {/* Search Input Box */}
      <div className="px-3 pb-2 shrink-0">
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-lg border border-white/5 bg-[#090b11] py-1.5 pl-8 pr-7 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-sky-500/40 focus:ring-1 focus:ring-sky-500/30 transition-all font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 text-slate-500 hover:text-slate-300"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Conversations Library List */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1 scrollbar-thin">
        {filteredConversations.length === 0 ? (
          <div className="flex h-36 flex-col items-center justify-center text-center px-4">
            <MessageSquare className="h-6 w-6 text-slate-600 mb-2 opacity-60" />
            <p className="text-xs text-slate-400 font-medium">
              {searchQuery ? 'No matching projects found' : 'No animations created yet'}
            </p>
            <p className="text-[10px] text-slate-600 mt-0.5">
              {searchQuery ? 'Try a different search keyword.' : 'Start your first concept above.'}
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filteredConversations.map((convo) => {
              const isActive = convo.id === selectedId;
              const isConfirming = confirmDeleteId === convo.id;

              return (
                <motion.div
                  key={convo.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className="group relative"
                >
                  <button
                    onClick={() => handleSelectConvo(convo.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-all ${
                      isActive
                        ? 'bg-[#181d2e] border border-sky-500/30 text-white font-medium shadow-sm'
                        : 'border border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                    }`}
                  >
                    <MessageSquare
                      className={`h-3.5 w-3.5 shrink-0 ${
                        isActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-400'
                      }`}
                    />
                    <div className="min-w-0 flex-1 pr-6">
                      <span className="block truncate text-xs">{convo.title}</span>
                      <span className="block text-[10px] text-slate-500 font-mono">
                        {formatRelativeTime(convo.created_at)}
                      </span>
                    </div>
                  </button>

                  {/* Delete button / Confirmation */}
                  <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center">
                    {isConfirming ? (
                      <div className="flex items-center gap-1 rounded bg-rose-950/80 border border-rose-500/40 p-0.5 shadow-lg">
                        <button
                          onClick={(e) => handleDelete(e, convo.id)}
                          className="flex h-5 items-center px-1.5 rounded bg-rose-600 text-[10px] font-bold text-white hover:bg-rose-500"
                          title="Confirm Delete"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(null);
                          }}
                          className="flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:text-white"
                          title="Cancel"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleDelete(e, convo.id)}
                        className="flex h-6 w-6 items-center justify-center rounded border border-transparent text-slate-500 opacity-0 group-hover:opacity-100 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 transition-all"
                        title="Delete animation"
                        aria-label="Delete animation conversation"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* User Session Footer */}
      <div className="shrink-0 border-t border-white/10 bg-[#090b11] p-3">
        <button
          onClick={() => {
            onLogout();
            if (isMobileView) onCloseMobile?.();
          }}
          className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-[10px] font-bold text-sky-400 uppercase">
              U
            </div>
            <div className="text-left">
              <span className="block text-xs font-semibold text-slate-300">Creator Account</span>
              <span className="block text-[9px] text-slate-500 font-mono">Free Plan</span>
            </div>
          </div>
          <LogOut className="h-4 w-4 shrink-0 text-slate-500 hover:text-rose-400 transition-colors" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex h-screen w-64 lg:w-72 shrink-0 flex-col border-r border-white/10 bg-[#0d1017] text-white">
        {renderContent(false)}
      </aside>

      {/* Mobile Off-canvas Drawer */}
      <AnimatePresence>
        {isOpenMobile && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Slide-out Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="relative z-10 flex h-full w-[85vw] max-w-[300px] flex-col border-r border-white/10 bg-[#0d1017] text-white shadow-2xl"
            >
              {renderContent(true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
