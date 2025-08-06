import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const SessionView = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/sessions/${id}`);
        setSession(res.data.data);
      } catch (err) {
        setError('Failed to load session.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;
  if (!session) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{session.title}</h1>
        <div className="flex gap-2">
          <Link to="/" className="btn-secondary">Dashboard</Link>
          <Link to="/my-sessions" className="btn-secondary">My Sessions</Link>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {session.tags && session.tags.map(tag => (
          <span key={tag} className="badge bg-primary-100 text-primary-800">{tag}</span>
        ))}
      </div>
      <div className="text-sm text-gray-600 mb-2">
        {session.category && <span className="mr-2">{session.category}</span>}
        {session.difficulty && <span className="mr-2">{session.difficulty}</span>}
        {session.duration && <span className="mr-2">{session.duration} min</span>}
      </div>
      <div className="mb-2 text-xs text-gray-400">
        By {session.author?.username || 'Unknown'} | Published: {session.publishedAt ? new Date(session.publishedAt).toLocaleString() : 'N/A'}
      </div>
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-line">{session.description}</p>
      </div>
      <div className="mb-4">
        <a
          href={session.jsonFileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          View JSON File
        </a>
      </div>
      <div className="flex gap-4 text-xs text-gray-500">
        <span>Views: {session.views}</span>
        <span>Likes: {session.likes}</span>
      </div>
    </div>
  );
};

export default SessionView;