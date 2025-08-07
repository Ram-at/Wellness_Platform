import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const AUTO_SAVE_DELAY = 5000; // 5 seconds

const defaultSession = {
  title: '',
  tags: '',
  jsonFileUrl: '',
  description: '',
  duration: 30,
  difficulty: 'beginner',
  category: 'other',
};

const SessionEditor = () => {
  const { id } = useParams(); // id is present if editing
  const navigate = useNavigate();
  const [session, setSession] = useState(defaultSession);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimeout = useRef(null);
  const isMounted = useRef(true);

  // Fetch session if editing
  useEffect(() => {
    isMounted.current = true;
    if (id) {
      axios.get(`https://wellness-platform-786k.vercel.app/api/sessions/my-sessions/${id}`)
        .then(res => {
          const s = res.data.data;
          setSession({
            title: s.title || '',
            tags: s.tags ? s.tags.join(', ') : '',
            jsonFileUrl: s.jsonFileUrl || '',
            description: s.description || '',
            duration: s.duration || 30,
            difficulty: s.difficulty || 'beginner',
            category: s.category || 'other',
          });
          setLastSaved(s.lastSaved ? new Date(s.lastSaved) : null);
        })
        .catch(() => setError('Failed to load session.'))
        .finally(() => setLoading(false));
    }
    return () => { isMounted.current = false; };
  }, [id]);

  // Auto-save logic
  useEffect(() => {
    if (!id) return; // Only auto-save for existing drafts
    if (!isMounted.current) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      handleSaveDraft();
    }, AUTO_SAVE_DELAY);
    return () => clearTimeout(saveTimeout.current);
    
  }, [session]);

  const handleChange = (e) => {
    setSession({ ...session, [e.target.name]: e.target.value });
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...session,
        tags: session.tags,
        sessionId: id,
      };
      const res = await axios.post('https://wellness-platform-786k.vercel.app/api/sessions/my-sessions/save-draft', payload);
      if (res.data.success) {
        setLastSaved(new Date());
        if (!id && res.data.data._id) {
          navigate(`/session/edit/${res.data.data._id}`, { replace: true });
        }
      }
    } catch (err) {
      setError('Failed to save draft.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    setError(null);
    try {
      let sessionId = id;
      // If new, save draft first
      if (!id) {
        const res = await axios.post('https://wellness-platform-786k.vercel.app/api/sessions/my-sessions/save-draft', session);
        if (res.data.success && res.data.data._id) {
          sessionId = res.data.data._id;
        } else {
          setError('Failed to save before publishing.');
          setPublishing(false);
          return;
        }
      }
      await axios.post('https://wellness-platform-786k.vercel.app/api/sessions/my-sessions/publish', { sessionId });
      navigate('/my-sessions');
    } catch (err) {
      setError('Failed to publish session.');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">{id ? 'Edit Session' : 'Create New Session'}</h1>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
      <form onSubmit={e => e.preventDefault()} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={session.title}
            onChange={handleChange}
            className="input-field mt-1"
            required
            placeholder="Session title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={session.tags}
            onChange={handleChange}
            className="input-field mt-1"
            placeholder="e.g. yoga, meditation"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">JSON File URL</label>
          <input
            type="text"
            name="jsonFileUrl"
            value={session.jsonFileUrl}
            onChange={handleChange}
            className="input-field mt-1"
            required
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={session.description}
            onChange={handleChange}
            className="input-field mt-1"
            rows={3}
            placeholder="Describe your session..."
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={session.duration}
              onChange={handleChange}
              className="input-field mt-1"
              min={1}
              max={300}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Difficulty</label>
            <select
              name="difficulty"
              value={session.difficulty}
              onChange={handleChange}
              className="input-field mt-1"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={session.category}
              onChange={handleChange}
              className="input-field mt-1"
            >
              <option value="yoga">Yoga</option>
              <option value="meditation">Meditation</option>
              <option value="breathing">Breathing</option>
              <option value="stretching">Stretching</option>
              <option value="mindfulness">Mindfulness</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            className="btn-success flex-1"
            onClick={handleSaveDraft}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            className="btn-primary flex-1"
            onClick={handlePublish}
            disabled={publishing}
          >
            {publishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
        {lastSaved && (
          <div className="text-xs text-gray-400 mt-2 text-right">
            Last saved: {lastSaved.toLocaleTimeString()}
          </div>
        )}
      </form>
    </div>
  );
};

export default SessionEditor;