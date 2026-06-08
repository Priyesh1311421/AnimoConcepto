import React, { useEffect, useState } from 'react';
import { AuthScreen } from './components/AuthScreen';
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

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvoId, setSelectedConvoId] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Check auth on startup
  useEffect(() => {
    const token = api.getToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch conversations if authenticated
  const loadConversations = async () => {
    try {
      const convos = await api.getConversations();
      setConversations(convos);
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        setIsAuthenticated(false);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    } else {
      setConversations([]);
      setSelectedConvoId(null);
      setPrompts([]);
    }
  }, [isAuthenticated]);

  // Fetch prompts when active conversation changes
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

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    api.removeToken();
    setIsAuthenticated(false);
  };

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
      // 1. If no conversation is selected, create one first dynamically
      if (!convoId) {
        // Derive conversation title from first few words of the prompt
        const title = promptText.length > 30 ? `${promptText.slice(0, 30)}...` : promptText;
        const newConvo = await api.createConversation(title);
        convoId = newConvo.id;
        setSelectedConvoId(convoId);
        
        // Add to conversation list locally
        setConversations(prev => [newConvo, ...prev]);
      }

      // 2. Add the user prompt locally so the chat updates instantly
      const userPromptItem: PromptItem = {
        id: 'user-temp-' + Date.now(),
        prompt: promptText,
        video_url: '',
        created_at: new Date().toISOString(),
        role: 'user',
      };
      setPrompts(prev => [...prev, userPromptItem]);

      // 3. Make generation request to FastAPI backend
      await api.generateVideo(promptText, convoId);

      // 4. Reload prompts to display rendered video & code
      if (convoId) {
        await loadPrompts(convoId);
      }
    } catch (err: any) {
      console.error('Error generating video', err);
      // Append an error block in the conversation message log
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
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0b14] text-white">
      <Sidebar
        conversations={conversations}
        selectedId={selectedConvoId}
        onSelect={setSelectedConvoId}
        onCreate={() => handleCreateConversation()}
        onDelete={handleDeleteConversation}
        onLogout={handleLogout}
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

export default App;
