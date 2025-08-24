import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Header.css';

const Header = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!sessionStorage.getItem('authToken');

    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        navigate('/login');
        window.location.reload(); // Forzar recarga para actualizar el estado
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    <img 
                        src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/30b9923c-c884-41c2-ba6c-c6636063df64.png" 
                        alt="Logo de CapacitaNet con texto en blanco sobre fondo azul violeta" 
                        className="logo-image"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                    <div className="logo-fallback">
                        CapacitaNet
                    </div>
                </Link>

                <nav className="navigation">
                    {isLoggedIn ? (
                        <>
                            <Link to="/dashboard" className="nav-link">
                                🏠 Dashboard
                            </Link>
                            <Link to="/perfil" className="nav-link">
                                👤 Perfil
                            </Link>
                            <button onClick={handleLogout} className="nav-link logout-btn">
                                🚪 Salir
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">
                                🔐 Iniciar Sesión
                            </Link>
                            <Link to="/register" className="nav-link">
                                📝 Registrarse
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
