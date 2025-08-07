import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { Pencil, Eye, Upload } from 'lucide-react';

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [publishing, setPublishing] = useState(null);
  const navigate = useNavigate();

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://wellness-platform-786k.vercel.app/api/sessions/my-sessions', { withCredentials: true });
      setSessions(res.data.data);
    } catch (err) {
      setError('Failed to load your sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handlePublish = async (sessionId) => {
    setPublishing(sessionId);
    try {
      await axios.post('https://wellness-platform-786k.vercel.app/api/sessions/my-sessions/publish', { sessionId }, { withCredentials: true });
      await fetchSessions();
    } catch (err) {
      alert('Failed to publish session.');
    } finally {
      setPublishing(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Sessions</h1>
        <Link to="/session/new" className="btn-primary">+ New Session</Link>
      </div>
      {sessions.length === 0 ? (
        <div className="text-center text-gray-500">You have no sessions yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map(session => (
            <div key={session._id} className="card flex flex-col h-full">
              <h2 className="text-lg font-semibold mb-2">{session.title}</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                {session.tags && session.tags.map(tag => (
                  <span key={tag} className="badge bg-primary-100 text-primary-800">{tag}</span>
                ))}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {session.category && <span className="mr-2">{session.category}</span>}
                {session.difficulty && <span className="mr-2">{session.difficulty}</span>}
              </div>
              <div className="mb-2">
                {session.isDraft ? (
                  <span className="badge badge-draft">Draft</span>
                ) : (
                  <span className="badge badge-published">Published</span>
                )}
              </div>
              <div className="flex gap-2 mt-auto">
                {session.isDraft ? (
                  <>
                    <button
                      className="btn-success flex items-center gap-1"
                      onClick={() => navigate(`/session/edit/${session._id}`)}
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      className="btn-primary flex items-center gap-1"
                      onClick={() => handlePublish(session._id)}
                      disabled={publishing === session._id}
                    >
                      <Upload size={16} />
                      {publishing === session._id ? 'Publishing...' : 'Publish'}
                    </button>
                  </>
                ) : (
                  <Link
                    to={`/session/${session._id}`}
                    className="btn-secondary flex items-center gap-1"
                  >
                    <Eye size={16} /> View
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySessions;