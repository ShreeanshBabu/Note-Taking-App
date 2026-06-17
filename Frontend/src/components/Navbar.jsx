import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav>
            <h3>Notes App</h3>
            {user && (
                <div className='tools'>
                    <span className='userName'>{user.name}</span>
                    <button className='logout' onClick={handleLogout}>Logout</button>
                </div>
            )}
        </nav>
    );
}