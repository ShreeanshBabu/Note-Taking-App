import { useNavigate } from 'react-router-dom';

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
        <div
            onClick={() => navigate(`/notes/${note._id}`)}
            style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                cursor: 'pointer',
                margin: '1rem',
            }}
        >
            <h3 style={{margin: '0 0 0.5rem 0'}}>{note.title}</h3>
            <p style={{margin: '0 0 0.5rem 0', color: '#666'}}>
                {note.content.slice(0,100)}
                {note.content.length > 100 ? '...' : ''}
            </p>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <small style={{color: '#999'}}>Updated {formattedDate}</small>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
}