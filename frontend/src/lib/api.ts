import { supabase } from './supabase';

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
};

// Use VITE_API_URL if defined. If not, use localhost:8000 for local dev, or relative paths for production.
const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:8000' : '');

export async function chat(messages: Message[]) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    let errorMessage = 'Server responded with an error';
    try {
      const errorData = await response.json();
      if (errorData && errorData.detail) {
        errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
      }
    } catch (e) {
      // Ignore if not JSON
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function healthCheck() {
  const response = await fetch(`${API_URL}/api/health`);
  if (!response.ok) {
    throw new Error('Backend not healthy');
  }
  return response.json();
}