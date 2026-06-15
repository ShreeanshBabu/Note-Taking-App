import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import NoteCard from "../components/NoteCard";
import { useSyncExternalStore } from "react";

export default function Dashboard() {
  const {user} = useAuth;
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notes');
      setNotes(res.data.notes);
    } catch (err) {
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      // Remove the delete note from state without refetching everything
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      alert('Failed to delete note');
    }
  };

  return (
    <div style={{maxWidth: '700px', margin: '0 auto', padding: '1rem'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h2>My Notes</h2>
        <button onClick={() => navigate('/notes/new')}>+ New Note</button>
      </div> 

      {loading && <p>Loading notes...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}

      {!loading && notes.length === 0 && (
        <p style={{color: '#999'}}>You don't have any notes yet. Create your first one!</p>
      )}

      {notes.map((note) => (
        <NoteCard key={note._id} note={note} onDelete={handleDelete} />
      ))}
    </div>
  );
}