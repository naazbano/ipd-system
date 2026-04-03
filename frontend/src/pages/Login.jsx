import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.success) {
            toast.success(`Welcome back, ${res.role}!`);
            navigate('staff/dashboard');
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-blue-600 text-center">Login</h2>
                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input type="email" placeholder="admin@hospital.com" required 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input type="password" placeholder="••••••••" required 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold shadow-lg hover:shadow-blue-200 transition-all">
                        Log In
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-500">Don't have an account? <Link to="/" className="text-blue-500 font-semibold">Register</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;