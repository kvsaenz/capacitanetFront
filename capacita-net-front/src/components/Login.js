import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
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

        if (!formData.username || !formData.password) {
            setError('Por favor completa todos los campos');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:9080/capacitanet/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                })
            });

            const data = await response.json();
            console.log(data);
            if (response.ok) {
                // Guardar el token en sessionStorage
                sessionStorage.setItem('authToken', data.message);
                setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
                
                // Redirigir usando navigate
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                setError(data.message || 'Error en el inicio de sesión');
            }
        } catch (err) {
            setError('Error de conexión. Verifica que el servidor esté funcionando.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const checkSession = () => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            setSuccess('Ya tienes una sesión activa');
        }
    };

    // Verificar si ya hay una sesión al cargar el componente
    useEffect(() => {
        checkSession();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 login-container">
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
                            Tu conocimiento, nuestro reconocimiento.
                        </h2>
                        <p className="text-gray-600">
                            Accede a tu cuenta para continuar aprendiendo
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Correo electrónico
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
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full input-field"
                                placeholder="Tu contraseña"
                                disabled={loading}
                            />
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
                                    Iniciando sesión...
                                </>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600 text-center">
                            ¿No tienes una cuenta?{' '}
                            <Link to="/register" className="text-blue-600 hover:underline">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        Al iniciar sesión, aceptas nuestros{' '}
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

export default Login;
