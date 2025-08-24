import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/EditarCurso.css';

const EditarCurso = () => {
    const { cursoId } = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [order, setOrder] = useState('');
    const [tipo, setTipo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            // Detectar automáticamente el tipo de archivo
            const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
            const fileTypeMap = {
                'mp4': 'mp4',
                'pdf': 'pdf',
                'docx': 'docx',
                'doc': 'docx',
                'pptx': 'pptx',
                'ppt': 'pptx',
                'txt': 'txt'
            };
            
            if (fileTypeMap[fileExtension]) {
                setTipo(fileTypeMap[fileExtension]);
            }
        }
    };

    const handleOrderChange = (e) => {
        setOrder(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!file || !order || !tipo) {
            setError('Por favor completa todos los campos obligatorios');
            setLoading(false);
            return;
        }

        const token = sessionStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('order', order);
        formData.append('tipo', tipo);

        try {
            const response = await fetch(`http://localhost:9080/capacitanet/cursos/${cursoId}/recursos`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (response.ok) {
                setSuccess('¡Recurso subido exitosamente!');
                setFile(null);
                setOrder('');
                setTipo('');
                // Limpiar el input de archivo
                document.getElementById('file').value = '';
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error al subir el recurso');
            }
        } catch (err) {
            setError('Error de conexión. Verifica que el servidor esté funcionando.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="editar-curso-container">
            <div className="editar-curso-header">
                <h1 className="editar-curso-title">📤 Subir Módulo al Curso: {cursoId}</h1>
                <button 
                    onClick={() => navigate('/crear-curso')}
                    className="back-btn"
                >
                    ← Volver a Cursos
                </button>
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

            <div className="upload-section">
                <h2 className="section-title">Subir Nuevo Módulo</h2>
                <p className="section-subtitle">
                    Completa la información para agregar un nuevo recurso al curso
                </p>

                <form onSubmit={handleSubmit} className="editar-curso-form">
                    <div className="form-group">
                        <label htmlFor="file" className="form-label">
                            Archivo del Módulo *
                        </label>
                        <input
                            type="file"
                            id="file"
                            onChange={handleFileChange}
                            className="file-input"
                            required
                            accept=".mp4,.pdf,.docx,.doc,.pptx,.ppt,.txt"
                        />
                        {file && (
                            <p className="file-info">
                                📄 Archivo seleccionado: {file.name} ({Math.round(file.size / 1024)} KB)
                            </p>
                        )}
                        <p className="form-help">
                            Formatos aceptados: MP4, PDF, DOCX, PPTX, TXT
                        </p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="order" className="form-label">
                            Orden del Módulo *
                        </label>
                        <input
                            type="number"
                            id="order"
                            value={order}
                            onChange={handleOrderChange}
                            className="form-input"
                            placeholder="Ej: 1, 2, 3..."
                            min="1"
                            required
                        />
                        <p className="form-help">
                            Número que define la secuencia del módulo en el curso
                        </p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tipo" className="form-label">
                            Tipo de Archivo *
                        </label>
                        <select
                            id="tipo"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            className="form-input"
                            required
                        >
                            <option value="">Selecciona el tipo de archivo</option>
                            <option value="mp4">🎬 MP4 (Video)</option>
                            <option value="pdf">📄 PDF (Documento)</option>
                            <option value="docx">📝 DOCX (Word)</option>
                            <option value="pptx">📊 PPTX (PowerPoint)</option>
                            <option value="txt">📃 TXT (Texto)</option>
                        </select>
                        <p className="form-help">
                            El tipo se detecta automáticamente, pero puedes ajustarlo si es necesario
                        </p>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={() => navigate('/crear-curso')}
                            className="cancel-btn"
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
                                    Subiendo módulo...
                                </>
                            ) : (
                                '🚀 Subir Módulo'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="instructions-section">
                <h3 className="instructions-title">💡 Instrucciones</h3>
                <ul className="instructions-list">
                    <li>Selecciona el archivo que deseas subir como módulo del curso</li>
                    <li>El orden determina la secuencia en que aparecerán los módulos</li>
                    <li>El tipo de archivo se detecta automáticamente, pero puedes modificarlo</li>
                    <li>Los formatos soportados son: videos MP4, documentos PDF, Word, PowerPoint y archivos de texto</li>
                    <li>Después de subir, el módulo estará disponible para los estudiantes</li>
                </ul>
            </div>
        </div>
    );
};

export default EditarCurso;
