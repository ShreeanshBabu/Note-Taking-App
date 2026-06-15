import { useNavigate } from 'react-router-dom';
import './NoteCard.css';

export default function NoteCard({note, onDelete}) {
    const navigate = useNavigate();
    const formattedDate = new Date(note.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const handleDelete = (e) => {
        e.stopPropagation(); // prevent the card click from firing too 
        if (window.confirm('Delete this note?')) {
            onDelete(note._id);
        }
    };

    return (
        <div className='card' onClick={() => navigate(`/notes/${note._id}`)}>
            <h3>{note.title}</h3>
            <p>
                {note.content.slice(0,100)}
                {note.content.length > 100 ? '...' : ''}
            </p>
            <div className='info'>
                <small>Updated {formattedDate}</small>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
}