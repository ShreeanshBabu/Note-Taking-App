import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import api from "../api/axios";

export default function NoteEditor() {
  const {id} = useParams(); // undefined for /notes/new, has a value for /notes/:id
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    try {
      const res = await api.get(`/notes/${id}`);
      setTitle(res.data.note.title);
      setContent(res.data.note.content);
    } catch (err) {
      setError('Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await api.put(`/notes/${id}`, {title, content});
      } else {
        await api.post('/notes', {title, content});
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p style={{textAlign: 'center'}}>Loading note...</p>
  }

  return (
    <div style={{maxWidth: '700px', margin: '0 auto', padding: '1rem'}}>
      <button onClick={() => navigate('/')} style={{marginBottom: '1rem'}}>
        ← Back
      </button>

      <h2>{isEditing ? 'Edit Note' : 'New Note'}</h2>

      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: '1rem'}}>
          <input 
            type="text" 
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{width: '100%', padding: '0.5rem', fontSize: '1.2rem'}}
          />
        </div>

        <div style={{marginBottom: '1rem'}}>
          <textarea 
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            style={{width: '100%', padding: '0.5rem', fontSize: '1rem', resize: 'none'}}
          />
        </div>

        {error && <p style={{color: 'red'}}>{error}</p>}

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Note'}
        </button>
      </form>
    </div>
  );
}