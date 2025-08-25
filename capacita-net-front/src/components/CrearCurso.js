import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CrearCurso.css';

const CrearCurso = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        cursoId: '',
        titulo: '',
        descripcion: '',
        tags: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [pendingCourses, setPendingCourses] = useState([]);

    // Lista de tags disponibles
    const availableTags = [
        { value: 'Fullstack', label: '🖥️ Fullstack' },
        { value: 'APIs e Integraciones', label: '🔗 APIs e Integraciones' },
        { value: 'Cloud', label: '☁️ Cloud' },
        { value: 'Data Engineer', label: '📊 Data Engineer' }
    ];

    // Función para obtener cursos pendientes
    const fetchPendingCourses = async () => {
        const token = sessionStorage.getItem('authToken');
        try {
            const response = await fetch('http://localhost:9080/capacitanet/obtener-cursos-pendientes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener los cursos pendientes');
            }

            const data = await response.json();
            setPendingCourses(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchPendingCourses();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccess('');
    };

    const handleTagChange = (tagValue) => {
        setFormData(prev => {
            const newTags = prev.tags.includes(tagValue)
                ? prev.tags.filter(tag => tag !== tagValue)
                : [...prev.tags, tagValue];
            
            return {
                ...prev,
                tags: newTags
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validaciones
        if (!formData.cursoId || !formData.titulo || !formData.descripcion) {
            setError('Por favor completa todos los campos obligatorios');
            setLoading(false);
            return;
        }

        if (formData.tags.length === 0) {
            setError('Selecciona al menos un tag');
            setLoading(false);
            return;
        }

        const token = sessionStorage.getItem('authToken');
        try {
            const response = await fetch('http://localhost:9080/capacitanet/crear-curso', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cursoId: formData.cursoId,
                    titulo: formData.titulo,
                    descripcion: formData.descripcion,
                    tags: formData.tags
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('¡Curso creado exitosamente!');
                // Limpiar formulario
                setFormData({
                    cursoId: '',
                    titulo: '',
                    descripcion: '',
                    tags: []
                });
                
                // Recargar la lista de cursos pendientes
                fetchPendingCourses();
                
                // Redirigir después de 2 segundos
                setTimeout(() => {
                    navigate('/crear-curso');
                }, 1000);
            } else {
                setError(data.message || 'Error al crear el curso');
            }
        } catch (err) {
            setError('Error de conexión. Verifica que el servidor esté funcionando.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const activateCourse = async (cursoId) => {
        const token = sessionStorage.getItem('authToken');
        try {
            const response = await fetch('http://localhost:9080/capacitanet/activar-curso', {
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
                setSuccess(`¡Curso ${cursoId} activado exitosamente!`);
                setTimeout(() => {
                    setSuccess('');
                    // Refrescar la lista de cursos pendientes
                    fetchPendingCourses();
                }, 2000);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error al activar el curso');
            }
        } catch (err) {
            setError('Error de conexión. Verifica que el servidor esté funcionando.');
        }
    };

    const handleEditCourse = (cursoId) => {
        navigate(`/editarCurso/${cursoId}`);
    };

    return (
        <div className="crear-curso-container">
            <div className="crear-curso-card">
                <div className="crear-curso-header">
                    <h1 className="crear-curso-title">🎓 Crear Nuevo Curso</h1>
                    <p className="crear-curso-subtitle">Completa la información para crear un nuevo curso</p>
                </div>

                <form onSubmit={handleSubmit} className="crear-curso-form">
                    <div className="form-group">
                        <label htmlFor="cursoId" className="form-label">
                            ID del Curso *
                        </label>
                        <input
                            type="text"
                            id="cursoId"
                            name="cursoId"
                            value={formData.cursoId}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Ej: curso101"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="titulo" className="form-label">
                            Título del Curso *
                        </label>
                        <input
                            type="text"
                            id="titulo"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Ej: Introducción a React"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion" className="form-label">
                            Descripción *
                        </label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            className="form-textarea"
                            placeholder="Describe el contenido y objetivos del curso..."
                            rows="4"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Tags *
                        </label>
                        <div className="tags-container">
                            {availableTags.map((tag) => (
                                <label key={tag.value} className="tag-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={formData.tags.includes(tag.value)}
                                        onChange={() => handleTagChange(tag.value)}
                                        disabled={loading}
                                    />
                                    <span className="tag-label">{tag.label}</span>
                                </label>
                            ))}
                        </div>
                        <p className="form-help">Selecciona al menos un tag</p>
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

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="cancel-btn"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner"></div>
                                    Creando curso...
                                </>
                            ) : (
                                '🎯 Crear Curso'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="pending-courses-section">
                <h2 className="pending-courses-title">Cursos Pendientes de Activar</h2>
                {pendingCourses.length === 0 ? (
                    <p>No hay cursos pendientes de activar.</p>
                ) : (
                    <div className="pending-courses-list">
                        {pendingCourses.map((curso) => (
                            <div key={curso.cursoId} className="pending-course-item">
                                <h3 className="pending-course-title">{curso.titulo}</h3>
                                <p className="pending-course-description">{curso.descripcion}</p>
                                <p className="pending-course-id">ID: {curso.cursoId}</p>
                                <div className="pending-course-actions">
                                    <button
                                        className="activate-btn"
                                        onClick={() => activateCourse(curso.cursoId)}
                                    >
                                        Activar
                                    </button>
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEditCourse(curso.cursoId)}
                                    >
                                        Editar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CrearCurso;
