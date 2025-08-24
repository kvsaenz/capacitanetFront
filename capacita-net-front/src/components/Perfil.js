import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Perfil.css';

const Perfil = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = sessionStorage.getItem('authToken');
            try {
                const response = await fetch('http://localhost:9080/capacitanet/perfil-usuario', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener el perfil del usuario');
                }

                const data = await response.json();
                setUserInfo(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return (
            <div className="perfil-container">
                <div className="loading-spinner-large"></div>
                <p>Cargando perfil...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="perfil-container">
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="perfil-container">
            <div className="perfil-card">
                <div className="perfil-header">
                    <h1 className="perfil-title">👤 Mi Perfil</h1>
                    <div className="perfil-avatar">
                        <img 
                            src="https://placehold.co/120x120/667eea/ffffff?text=👤" 
                            alt="Avatar del usuario con fondo azul e icono de persona"
                            className="avatar-image"
                        />
                    </div>
                </div>

                <div className="perfil-info">
                    <div className="info-group">
                        <label className="info-label">Nombre de usuario:</label>
                        <span className="info-value">{userInfo.username}</span>
                    </div>
                    <div className="info-group">
                        <label className="info-label">Nombre:</label>
                        <span className="info-value">{userInfo.nombre}</span>
                    </div>
                    <div className="info-group">
                        <label className="info-label">Apellido:</label>
                        <span className="info-value">{userInfo.apellido}</span>
                    </div>
                    <div className="info-group">
                        <label className="info-label">Estado:</label>
                        <span className="info-value status-active">✅ Activo</span>
                    </div>
                </div>

                <h2 className="cursos-title">Cursos Suscritos</h2>
                <div className="cursos-list">
                    {userInfo.cursos && userInfo.cursos.map((curso) => (
                        <div key={curso.cursoId} className="curso-card">
                            <Link to={`/dashboard?cursoId=${curso.cursoId}`} className="curso-title">
                                {curso.titulo}
                            </Link>
                            <p className="curso-description">{curso.descripcion}</p>
                            <div className="recursos-section">
                                <h4 className="recursos-title">Recursos:</h4>
                                <ul className="recursos-list">
                                    {curso.recursos && curso.recursos.map((recurso) => (
                                        <li key={recurso.id} className="recurso-item">
                                            <span className="recurso-name">{recurso.nombre}</span>
                                            <span className={`recurso-visualizado ${recurso.visualizado ? 'visualizado' : 'no-visualizado'}`}>
                                                {recurso.visualizado ? '👁️ Visualizado' : '👁️ No visualizado'}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Perfil;
