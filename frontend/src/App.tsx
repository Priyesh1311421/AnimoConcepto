import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { AuthScreen } from './components/AuthScreen';
import { LandingPage } from './components/LandingPage';
import { FeaturesPage } from './components/FeaturesPage';
import { PricingPage } from './components/PricingPage';
import { DocsPage } from './components/DocsPage';
import { BlogPage } from './components/BlogPage';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { api } from './utils/api';

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

interface PromptItem {
  id: string;
  prompt: string;
  video_url: string;
  created_at: string;
  role?: 'user' | 'assistant';
  isError?: boolean;
}

const AppWorkspace: React.FC<{
  isAuthenticated: boolean;
  onLogout: () => void;
}> = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvoId, setSelectedConvoId] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const loadConversations = useCallback(async () => {
    try {
      const convos = await api.getConversations();
      setConversations(convos);
    } catch (err: unknown) {
      if ((err as Error).message === 'Unauthorized') {
        onLogout();
        navigate('/auth');
      }
    }
  }, [navigate, onLogout]);

  const loadPrompts = useCallback(async (convoId: string) => {
    try {
      const promptList = await api.getPrompts(convoId);
      setPrompts(promptList);
    } catch (err: unknown) {
      console.error('Error fetching prompts', err);
    }
  }, []);

  const handleSendPrompt = useCallback(async (promptText: string) => {
    let convoId = selectedConvoId;
    setIsGenerating(true);

    try {
      if (!convoId) {
        const title = promptText.length > 32 ? `${promptText.slice(0, 32)}...` : promptText;
        const newConvo = await api.createConversation(title);
        convoId = newConvo.id;
        setSelectedConvoId(convoId);
        setConversations((prev) => [newConvo, ...prev]);
      }

      const userPromptItem: PromptItem = {
        id: 'user-temp-' + Date.now(),
        prompt: promptText,
        video_url: '',
        created_at: new Date().toISOString(),
        role: 'user',
      };
      setPrompts((prev) => [...prev, userPromptItem]);

      await api.generateVideo(promptText, convoId);

      if (convoId) {
        await loadPrompts(convoId);
      }
    } catch (err: unknown) {
      console.error('Error generating video', err);
      const errorItem: PromptItem = {
        id: 'error-temp-' + Date.now(),
        prompt: (err as Error).message || 'Scene render failed. The rendering engine encountered an issue.',
        video_url: '',
        created_at: new Date().toISOString(),
        role: 'assistant',
        isError: true,
      };
      setPrompts((prev) => [...prev, errorItem]);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedConvoId, loadPrompts]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    loadConversations();
  }, [isAuthenticated, loadConversations, navigate]);

  useEffect(() => {
    if (selectedConvoId) {
      if (!isGenerating) {
        loadPrompts(selectedConvoId);
      }
    } else {
      setPrompts([]);
    }
  }, [selectedConvoId, loadPrompts, isGenerating]);

  // Handle incoming query param prompt (e.g. from LandingPage prompt box)
  useEffect(() => {
    const incomingPrompt = searchParams.get('prompt') || sessionStorage.getItem('pendingPrompt');
    if (incomingPrompt && isAuthenticated && !isGenerating) {
      sessionStorage.removeItem('pendingPrompt');
      handleSendPrompt(incomingPrompt);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('prompt');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, isAuthenticated, isGenerating, handleSendPrompt, setSearchParams]);

  const handleNewAnimationStudio = () => {
    setSelectedConvoId(null);
    setPrompts([]);
    setIsMobileSidebarOpen(false);
  };

  const handleDeleteConversation = async (convoId: string) => {
    try {
      await api.deleteConversation(convoId);
      setConversations((prev) => prev.filter((c) => c.id !== convoId));
      if (selectedConvoId === convoId) {
        setSelectedConvoId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getActiveConvoTitle = (): string | null => {
    const convo = conversations.find((c) => c.id === selectedConvoId);
    return convo ? convo.title : null;
  };

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090a0f] text-white">
      <Sidebar
        conversations={conversations}
        selectedId={selectedConvoId}
        onSelect={(id) => {
          setSelectedConvoId(id);
          setIsMobileSidebarOpen(false);
        }}
        onCreate={handleNewAnimationStudio}
        onDelete={handleDeleteConversation}
        onLogout={onLogout}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />
      <ChatArea
        prompts={prompts}
        isGenerating={isGenerating}
        onSubmitPrompt={handleSendPrompt}
        convoTitle={getActiveConvoTitle()}
        onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        onNewChat={handleNewAnimationStudio}
      />
    </div>
  );
};

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!api.getToken());

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    api.removeToken();
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage onGetStarted={() => { }} />} />
        <Route
          path="/auth"
          element={
            isAuthenticated ? (
              <Navigate to="/app" replace />
            ) : (
              <AuthScreen onAuthSuccess={handleAuthSuccess} />
            )
          }
        />
        <Route
          path="/app"
          element={<AppWorkspace isAuthenticated={isAuthenticated} onLogout={handleLogout} />}
        />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
