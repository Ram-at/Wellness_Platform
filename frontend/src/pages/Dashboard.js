import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/sessions');
        setSessions(res.data.data);
      } catch (err) {
        setError('Failed to load sessions.');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">Public Wellness Sessions</h1>
      {sessions?.length === 0 ? (
        <div className="text-center text-gray-500">No public sessions found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map(session => (
            <Link to={`/session/${session._id}`} key={session._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col h-full">
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
                <div className="text-xs text-gray-400 mt-auto">By {session.author?.username || 'Unknown'}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
