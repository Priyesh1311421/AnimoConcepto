import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvoId, setSelectedConvoId] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    loadConversations();
  }, [isAuthenticated]);

  const loadConversations = async () => {
    try {
      const convos = await api.getConversations();
      setConversations(convos);
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        onLogout();
        navigate('/auth');
      }
    }
  };

  const loadPrompts = async (convoId: string) => {
    try {
      const promptList = await api.getPrompts(convoId);
      setPrompts(promptList);
    } catch (err: any) {
      console.error('Error fetching prompts', err);
    }
  };

  useEffect(() => {
    if (selectedConvoId) {
      loadPrompts(selectedConvoId);
    } else {
      setPrompts([]);
    }
  }, [selectedConvoId]);

  const handleCreateConversation = async (title?: string) => {
    try {
      const newConvo = await api.createConversation(title || 'Untitled Animation');
      setConversations(prev => [newConvo, ...prev]);
      setSelectedConvoId(newConvo.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConversation = async (convoId: string) => {
    try {
      await api.deleteConversation(convoId);
      setConversations(prev => prev.filter(c => c.id !== convoId));
      if (selectedConvoId === convoId) {
        setSelectedConvoId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendPrompt = async (promptText: string) => {
    let convoId = selectedConvoId;
    setIsGenerating(true);

    try {
      if (!convoId) {
        const title = promptText.length > 30 ? `${promptText.slice(0, 30)}...` : promptText;
        const newConvo = await api.createConversation(title);
        convoId = newConvo.id;
        setSelectedConvoId(convoId);
        setConversations(prev => [newConvo, ...prev]);
      }

      const userPromptItem: PromptItem = {
        id: 'user-temp-' + Date.now(),
        prompt: promptText,
        video_url: '',
        created_at: new Date().toISOString(),
        role: 'user',
      };
      setPrompts(prev => [...prev, userPromptItem]);

      await api.generateVideo(promptText, convoId);

      if (convoId) {
        await loadPrompts(convoId);
      }
    } catch (err: any) {
      console.error('Error generating video', err);
      const errorItem: PromptItem = {
        id: 'error-temp-' + Date.now(),
        prompt: 'error generating video',
        video_url: '',
        created_at: new Date().toISOString(),
        role: 'assistant',
        isError: true,
      };
      setPrompts(prev => [...prev, errorItem]);
    } finally {
      setIsGenerating(false);
    }
  };

  const getActiveConvoTitle = (): string | null => {
    const convo = conversations.find(c => c.id === selectedConvoId);
    return convo ? convo.title : null;
  };

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#00111c] text-white">
      <Sidebar
        conversations={conversations}
        selectedId={selectedConvoId}
        onSelect={setSelectedConvoId}
        onCreate={() => handleCreateConversation()}
        onDelete={handleDeleteConversation}
        onLogout={onLogout}
      />
      <ChatArea
        prompts={prompts}
        isGenerating={isGenerating}
        onSubmitPrompt={handleSendPrompt}
        convoTitle={getActiveConvoTitle()}
      />
    </div>
  );
};

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = api.getToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

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
        <Route path="/" element={<LandingPage onGetStarted={() => {}} />} />
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
