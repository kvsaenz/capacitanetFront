import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../css/Dashboard.css';

const Dashboard = () => {
    const [cursos, setCursos] = useState([]);
    const [filteredCursos, setFilteredCursos] = useState([]);
    const [selectedResource, setSelectedResource] = useState(null);
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const cursoId = searchParams.get('cursoId');

    useEffect(() => {
        const fetchCursos = async () => {
            const token = sessionStorage.getItem('authToken');
            try {
                const response = await fetch('http://localhost:9080/capacitanet/obtener-cursos', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener los cursos');
                }

                const data = await response.json();
                setCursos(data);
                
                // Aplicar filtros iniciales
                applyFilters(data, cursoId, searchTerm);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCursos();
    }, [cursoId]);

    useEffect(() => {
        // Aplicar filtros cuando cambia el término de búsqueda
        applyFilters(cursos, cursoId, searchTerm);
    }, [searchTerm, cursos, cursoId]);

    const applyFilters = (cursosData, cursoIdParam, searchTermParam) => {
        let filtered = [...cursosData];

        // Primero filtrar por cursoId si existe
        if (cursoIdParam) {
            filtered = filtered.filter(curso => curso.cursoId === cursoIdParam);
        }

        // Luego filtrar por término de búsqueda
        if (searchTermParam) {
            const term = searchTermParam.toLowerCase();
            filtered = filtered.filter(curso => 
                curso.titulo.toLowerCase().includes(term) ||
                curso.descripcion.toLowerCase().includes(term) ||
                curso.tags.some(tag => tag.toLowerCase().includes(term))
            );
        }

        setFilteredCursos(filtered);
    };

    const handleResourceClick = (resource, curso) => {
        setSelectedResource(resource);
        setSelectedCurso(curso);
    };

    const handleSubscribe = async (cursoId) => {
        const token = sessionStorage.getItem('authToken');
        try {
            const response = await fetch('http://localhost:9080/capacitanet/suscribirme-curso', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cursoId: cursoId
                })
            });

            if (response.ok) {
                setSuccess('¡Te has suscrito al curso exitosamente!');
                setTimeout(() => setSuccess(''), 3000);
                
                // Recargar los cursos para actualizar el estado
                const refreshResponse = await fetch('http://localhost:9080/capacitanet/obtener-cursos', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    setCursos(data);
                    applyFilters(data, cursoId, searchTerm);
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error al suscribirse al curso');
                setTimeout(() => setError(''), 3000);
            }
        } catch (err) {
            setError('Error de conexión. Verifica que el servidor esté funcionando.');
            setTimeout(() => setError(''), 3000);
        }
    };

    const clearFilter = () => {
        // Limpiar el parámetro de búsqueda
        window.history.replaceState({}, '', '/dashboard');
        setSearchTerm('');
        applyFilters(cursos, null, '');
        window.location.reload();
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    const getResourceIcon = (tipo) => {
        switch (tipo) {
            case 'mp4': return '🎬';
            case 'pdf': return '📄';
            case 'docx': return '📝';
            case 'pptx': return '📊';
            case 'txt': return '📃';
            default: return '📁';
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading-spinner-large"></div>
                <p>Cargando cursos...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">
                    {cursoId ? `Curso Específico` : 'Cursos Disponibles'}
                </h1>
                <div className="user-info">
                    {cursoId && (
                        <button onClick={clearFilter} className="clear-filter-btn">
                            ← Ver todos los cursos
                        </button>
                    )}
                    <span>Bienvenido</span>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {success && (
                <div className="success-message">
                    {success}
                </div>
            )}

            {/* Barra de búsqueda y filtros */}
            {!cursoId && (
                <div className="search-filters">
                    <div className="search-bar">
                        <div className="search-input-container">
                            <input
                                type="text"
                                placeholder="🔍 Buscar cursos por título o descripción..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            {searchTerm && (
                                <button onClick={clearSearch} className="clear-search-btn">
                                    ✕
                                </button>
                            )}
                        </div>
                        <div className="search-stats">
                            {searchTerm && (
                                <span className="search-results">
                                    {filteredCursos.length} curso(s) encontrado(s)
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {filteredCursos.length === 0 && !loading && (
                <div className="no-courses-message">
                    <p>
                        {cursoId 
                            ? `No se encontró el curso`
                            : searchTerm
                            ? `No se encontraron cursos que coincidan con "${searchTerm}"`
                            : 'No hay cursos disponibles'
                        }
                    </p>
                    {searchTerm && (
                        <button onClick={clearSearch} className="clear-search-btn-large">
                            Limpiar búsqueda
                        </button>
                    )}
                </div>
            )}

            <div className="dashboard-content">
                <div className="courses-section">
                    <h2 className="section-title">
                        {cursoId 
                            ? 'Curso Filtrado' 
                            : searchTerm
                            ? `Resultados de búsqueda${filteredCursos.length > 0 ? `: ${filteredCursos.length} curso(s)` : ''}`
                            : 'Lista de Cursos'
                        }
                        {cursoId && filteredCursos.length > 0 && `: ${filteredCursos[0].titulo}`}
                    </h2>
                    <div className="courses-grid">
                        {filteredCursos.map((curso) => (
                            <div key={curso.cursoId} className="course-card">
                                <div className="course-header">
                                    <h3 className="course-title">{curso.titulo}</h3>
                                    <button
                                        className="subscribe-btn"
                                        onClick={() => handleSubscribe(curso.cursoId)}
                                    >
                                        Suscribirse
                                    </button>
                                </div>
                                
                                <p className="course-description">{curso.descripcion}</p>
                                
                                <div className="course-meta">
                                    <span className="course-id">ID: {curso.cursoId}</span>
                                    <span className="course-creator">Creador: {curso.creadorUsername}</span>
                                </div>

                                <div className="course-tags">
                                    {curso.tags.map((tag, index) => (
                                        <span key={index} className="tag">{tag}</span>
                                    ))}
                                </div>

                                <div className="resources-section">
                                    <h4 className="resources-title">Recursos ({curso.recursos.length})</h4>
                                    <div className="resources-list">
                                        {curso.recursos.sort((a, b) => a.order - b.order).map((recurso) => (
                                            <div
                                                key={recurso.id}
                                                className={`resource-item ${selectedResource?.id === recurso.id ? 'active' : ''}`}
                                                onClick={() => handleResourceClick(recurso, curso)}
                                            >
                                                <span className="resource-icon">{getResourceIcon(recurso.tipo)}</span>
                                                <span className="resource-name">{recurso.nombre}</span>
                                                <span className="resource-type">{recurso.tipo}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="resource-view-section">
                    <h2 className="section-title">Visualizador de Recursos</h2>
                    {selectedResource ? (
                        <div className="resource-viewer">
                            <div className="resource-header">
                                <h3 className="resource-title">{selectedResource.nombre}</h3>
                                <span className="resource-curso">Curso: {selectedCurso?.titulo}</span>
                            </div>

                            <div className="resource-content">
                                {selectedResource.tipo === 'mp4' && (
                                    <div className="video-container">
                                        <video controls className="video-player">
                                            <source src={selectedResource.s3Key} type="video/mp4" />
                                            Tu navegador no soporta el video.
                                        </video>
                                    </div>
                                )}

                                {selectedResource.tipo === 'pdf' && (
                                    <div className="pdf-container">
                                        <iframe
                                            src={selectedResource.s3Key}
                                            className="pdf-viewer"
                                            title="PDF Viewer"
                                        />
                                    </div>
                                )}

                                {['docx', 'pptx', 'txt'].includes(selectedResource.tipo) && (
                                    <div className="download-container">
                                        <div className="download-message">
                                            <p>Este tipo de archivo no puede visualizarse directamente.</p>
                                            <p>Puedes descargarlo para verlo en tu dispositivo.</p>
                                        </div>
                                        <a
                                            href={selectedResource.s3Key}
                                            download
                                            className="download-btn"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            📥 Descargar Archivo
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="no-resource-selected">
                            <div className="placeholder-icon">📚</div>
                            <p>Selecciona un recurso de la lista para visualizarlo</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
