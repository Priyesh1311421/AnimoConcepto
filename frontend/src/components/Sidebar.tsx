import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Video, LogOut, MessageSquare, ArrowLeft, X } from 'lucide-react';

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

  const handleSelectConvo = (id: string) => {
    onSelect(id);
    onCloseMobile?.();
  };

  const handleCreateNew = () => {
    onCreate();
    onCloseMobile?.();
  };

  const renderContent = (isMobileView: boolean = false) => (
    <div className="flex h-full w-full flex-col">
      {/* Brand Header with Back to Home and Mobile Close Button */}
      <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-[#002e4e]">
        <button
          onClick={() => {
            navigate('/');
            if (isMobileView) onCloseMobile?.();
          }}
          className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:bg-[#00253e] hover:text-white transition-colors"
          title="Back to Homepage"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-[#38bdf8]" />
          <span>Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00406c] border border-[#005a96] shadow-md">
            <Video className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-white font-outfit">
            Animo<span className="text-[#38bdf8]">Concepto</span>
          </span>
        </div>

        {isMobileView && (
          <button
            onClick={onCloseMobile}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#002e4e] bg-[#00111c] text-slate-400 hover:text-white hover:bg-[#00253e] transition-colors"
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* New Animation Button */}
      <div className="p-4 shrink-0">
        <motion.button
          whileHover={{ scale: 1.02, border: '1px solid #005a96' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateNew}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#002e4e] bg-[#00111c] py-3 text-sm font-semibold transition-all duration-300 hover:bg-[#002137]"
        >
          <Plus className="h-4 w-4 text-[#38bdf8]" />
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
                    onClick={() => handleSelectConvo(convo.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-[#00253e] border border-[#00406c] text-white font-medium shadow-inner'
                        : 'border border-transparent text-slate-400 hover:bg-[#002137] hover:text-white'
                    }`}
                  >
                    <MessageSquare className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#38bdf8]' : 'text-slate-500'}`} />
                    <span className="truncate pr-8">{convo.title}</span>
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(convo.id);
                    }}
                    className="absolute top-1/2 right-3 h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md border border-white/5 bg-[#00111c] text-slate-500 opacity-80 md:opacity-0 transition-all duration-300 hover:border-rose-500/40 hover:text-rose-400 hover:shadow-lg hover:shadow-rose-950/20 md:group-hover:opacity-100 flex"
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
      <div className="shrink-0 border-t border-[#002e4e] bg-[#00111c]/60 p-4">
        <button
          onClick={() => {
            onLogout();
            if (isMobileView) onCloseMobile?.();
          }}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-slate-400 transition-colors duration-300 hover:bg-[#00253e] hover:text-white"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-8 w-8 rounded-full bg-[#00406c] border border-[#005a96] flex items-center justify-center text-xs font-bold text-white uppercase">
              U
            </div>
            <span className="text-xs font-semibold tracking-wide">User Account</span>
          </div>
          <LogOut className="h-4.5 w-4.5 shrink-0" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (md and up) */}
      <aside className="hidden md:flex h-screen w-72 lg:w-80 shrink-0 flex-col border-r border-[#002e4e] bg-[#001a2c] text-white">
        {renderContent(false)}
      </aside>

      {/* Mobile Off-canvas Drawer (below md) */}
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
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative z-10 flex h-full w-[85vw] max-w-[320px] flex-col border-r border-[#002e4e] bg-[#001a2c] text-white shadow-2xl"
            >
              {renderContent(true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
