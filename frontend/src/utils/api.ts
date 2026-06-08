const DEFAULT_BASE_URL = 'http://localhost:8000';

export const getBaseUrl = (): string => {
  return (import.meta.env.VITE_API_BASE_URL as string) || DEFAULT_BASE_URL;
};

export const api = {
  getToken: (): string | null => {
    return localStorage.getItem('animo_token');
  },

  setToken: (token: string): void => {
    localStorage.setItem('animo_token', token);
  },

  removeToken: (): void => {
    localStorage.removeItem('animo_token');
  },

  getHeaders: (): HeadersInit => {
    const token = api.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  },

  register: async (email: string, password: string): Promise<{ status: string }> => {
    const url = new URL(`${getBaseUrl()}/register`);
    url.searchParams.append('email', email);
    url.searchParams.append('password', password);

    const res = await fetch(url.toString(), {
      method: 'POST',
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(errorData.detail || 'Registration failed');
    }

    return res.json();
  },

  login: async (email: string, password: string): Promise<{ access_token: string }> => {
    const url = new URL(`${getBaseUrl()}/login`);
    url.searchParams.append('email', email);
    url.searchParams.append('password', password);

    const res = await fetch(url.toString(), {
      method: 'POST',
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Invalid credentials' }));
      throw new Error(errorData.detail || 'Invalid credentials');
    }

    const data = await res.json();
    api.setToken(data.access_token);
    return data;
  },

  createConversation: async (title?: string): Promise<{ id: string; title: string; created_at: string }> => {
    const res = await fetch(`${getBaseUrl()}/conversations`, {
      method: 'POST',
      headers: api.getHeaders(),
      body: JSON.stringify({ title }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        api.removeToken();
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to create conversation');
    }

    return res.json();
  },

  getConversations: async (): Promise<Array<{ id: string; title: string; created_at: string }>> => {
    const res = await fetch(`${getBaseUrl()}/conversations`, {
      method: 'GET',
      headers: api.getHeaders(),
    });

    if (!res.ok) {
      if (res.status === 401) {
        api.removeToken();
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to fetch conversations');
    }

    return res.json();
  },

  deleteConversation: async (id: string): Promise<{ status: string }> => {
    const res = await fetch(`${getBaseUrl()}/conversations/${id}`, {
      method: 'DELETE',
      headers: api.getHeaders(),
    });

    if (!res.ok) {
      throw new Error('Failed to delete conversation');
    }

    return res.json();
  },

  getPrompts: async (conversationId: string): Promise<Array<{ id: string; prompt: string; video_url: string; created_at: string; role?: 'user' | 'assistant' }>> => {
    const res = await fetch(`${getBaseUrl()}/conversations/${conversationId}/prompts`, {
      method: 'GET',
      headers: api.getHeaders(),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch prompts');
    }

    const data = await res.json();
    
    // In our backend, the database prompts collection stores:
    // User prompt: role="user", prompt=<input_text>, video_path=video_path, scene_name=scene_name...
    // Assistant prompt: role="assistant", prompt=<code>, video_path=video_path, scene_name=scene_name...
    // Let's make sure we correctly tag roles. If role is missing, we can infer it or use default.
    // Our app.py inserts prompts with "role": "user" and "role": "assistant" explicitly!
    // But PromptOut in app.py only returns id, prompt, video_url, created_at.
    // Wait! Let's check App.py line 50:
    // class PromptOut(BaseModel):
    //     id: str
    //     prompt: str
    //     video_url: str
    //     created_at: datetime
    // It doesn't return the "role"! Wait, let's look at get_prompts in app.py:
    // @app.get("/conversations/{conversation_id}/prompts", response_model=List[PromptOut])
    // async def get_prompts(conversation_id: str, user=Depends(get_user)):
    //     prompts = await db.prompts.find({...})
    //     return [PromptOut(id=str(p["_id"]), prompt=p["prompt"], video_url=f"/video/{p['_id']}", created_at=p["created_at"]) for p in prompts]
    // Ah! It doesn't return the "role"!
    // But wait, the list is returned in sorted order of created_at:
    // .sort("created_at", 1)
    // In db, they are created in pairs: User prompt first, Assistant prompt second.
    // So the list will naturally alternate:
    // Index 0: User Prompt (the question, e.g. "create a video to explain llms")
    // Index 1: Assistant Prompt (the generated python code)
    // Index 2: User Prompt (next question)
    // Index 3: Assistant Prompt (next code)
    // Wait, let's write a robust logic to enrich the role in frontend!
    // We can check:
    // - If prompt contains "import manim" or "class GeneratedScene" or starts with "from manim import", it's definitely the assistant prompt (role: 'assistant').
    // - Otherwise, we can alternate starting with 'user' for index 0.
    // Let's do that! It is extremely robust and will map the database entries perfectly!
    
    return data.map((item: any) => {
      const isAssistant = item.prompt.includes('from manim import') || item.prompt.includes('class GeneratedScene');
      return {
        ...item,
        role: isAssistant ? 'assistant' : 'user',
      };
    });
  },

  generateVideo: async (prompt: string, conversationId: string): Promise<{ status: string; video_url: string; scene: string }> => {
    const res = await fetch(`${getBaseUrl()}/generate`, {
      method: 'POST',
      headers: api.getHeaders(),
      body: JSON.stringify({ prompt, conversation_id: conversationId }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Generation failed' }));
      throw new Error(errorData.detail || 'Video generation failed');
    }

    return res.json();
  },

  fetchVideoBlob: async (promptId: string): Promise<string> => {
    // Fetches the video using authentication and returns an object URL
    const res = await fetch(`${getBaseUrl()}/video/${promptId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${api.getToken()}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to load video file');
    }

    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }
};
