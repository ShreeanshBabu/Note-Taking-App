import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import NoteCard from "../components/NoteCard";
import { useSyncExternalStore } from "react";
import './Dashboard.css';

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
    <div className="backgroundDash">
      <div className="dashboard">
        <div className="topBar">
          <h2>My Notes</h2>
          <button className="newNote" onClick={() => navigate('/notes/new')}>+ New Note</button>
        </div> 

        {loading && <p>Loading notes...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && notes.length === 0 && (
          <p className="emptyText">You don't have any notes yet. Create your first one!</p>
        )}

        <div className="notes">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}