import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        nombre: '',
        apellido: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validación de campos
        if (!formData.username || !formData.nombre || !formData.apellido || !formData.password) {
            setError('Por favor completa todos los campos');
            setLoading(false);
            return;
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.username)) {
            setError('Por favor ingresa un correo electrónico válido');
            setLoading(false);
            return;
        }

        // Validación de contraseña (mínimo 6 caracteres)
        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:9080/capacitanet/registrar-usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    password: formData.password
                })
            });

            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setSuccess('¡Registro exitoso! Serás redirigido al login...');
                
                // Redirigir al login usando navigate
                sessionStorage.removeItem('authToken');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Error de conexión. Verifica que el servidor esté funcionando.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 register-container">
            <div className="w-full max-w-md">
                <div className="udemy-style-card p-8">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <img 
                                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/30b9923c-c884-41c2-ba6c-c6636063df64.png" 
                                alt="Logo de CapacitaNet con texto en blanco sobre fondo azul violeta" 
                                className="h-10"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <div 
                                className="h-10 bg-purple-700 text-white flex items-center justify-center px-3 rounded font-bold text-lg"
                                style={{ display: 'none' }}
                            >
                                CapacitaNet
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Crear Cuenta
                        </h2>
                        <p className="text-gray-600">
                            Únete a nuestra plataforma de aprendizaje
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Correo electrónico *
                            </label>
                            <input
                                type="email"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full input-field"
                                placeholder="tu@email.com"
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    className="w-full input-field"
                                    placeholder="Tu nombre"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
                                    Apellido *
                                </label>
                                <input
                                    type="text"
                                    id="apellido"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleInputChange}
                                    className="w-full input-field"
                                    placeholder="Tu apellido"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña *
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full input-field"
                                placeholder="Mínimo 6 caracteres"
                                disabled={loading}
                                minLength="6"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                La contraseña debe tener al menos 6 caracteres
                            </p>
                        </div>

                        {error && (
                            <div className="error-message text-center">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="success-message text-center">
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full btn-primary flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner mr-2"></div>
                                    Creando cuenta...
                                </>
                            ) : (
                                'Crear Cuenta'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600 text-center">
                            ¿Ya tienes una cuenta?{' '}
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        Al registrarte, aceptas nuestros{' '}
                        <a href="#terms" className="text-blue-600 hover:underline">
                            Términos de uso
                        </a>{' '}
                        y{' '}
                        <a href="#privacy" className="text-blue-600 hover:underline">
                            Política de privacidad
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
