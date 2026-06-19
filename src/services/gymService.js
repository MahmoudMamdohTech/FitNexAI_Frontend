// Gym Service — AI Camera analysis + workout persistence
import api from './api';

export const gymService = {
  async listExercises() {
    const res = await api.get('/api/v1/exercises');
    return res.exercises ?? [];
  },

  async analyzeFrame(sessionId, exercise, frameB64) {
    const aiUrl = import.meta.env.VITE_AI_URL;
    const res = await fetch(`${aiUrl}/api/v1/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, exercise, frame_b64: frameB64 }),
    });
    if (!res.ok) throw new Error('AI analysis failed');
    return await res.json();
  },

  async resetSession(sessionId) {
    const aiUrl = import.meta.env.VITE_AI_URL;
    const res = await fetch(`${aiUrl}/api/v1/reset-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    });
    return await res.json();
  },

  // user_id comes from JWT on the server
  async saveWorkout(exercise, reps, score = 0, durationSeconds = 0) {
    return await api.post('/api/v1/gym/workout', {
      exercise,
      reps,
      score,
      duration_seconds: durationSeconds,
    });
  },

  async getWorkoutHistory(limit = 50) {
    return await api.get(`/api/v1/gym/history?limit=${limit}`);
  },
};
