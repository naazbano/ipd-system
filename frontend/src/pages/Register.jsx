import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../utils/utils';
const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Staff' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post( `${BACKEND_URL}/auth/register`, formData);
            toast.success('Registration Successful! Please Login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration Failed');
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
          
            <div className="hidden lg:flex w-1/2 bg-blue-600 items-center justify-center text-white p-12">
                <div>
                    <h1 className="text-4xl font-bold mb-4">Care & Management</h1>
                    <p className="text-lg opacity-80">Streamlining IPD Admissions and Hospital Billing for Doctors and Staff.</p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" placeholder="Full Name" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        
                        <input type="email" placeholder="Email Address" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        
                        <input type="password" placeholder="Password" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            onChange={(e) => setFormData({...formData, password: e.target.value})} />

                        {/* Role Selection */}
                        <select className="w-full p-3 border rounded-lg bg-white outline-none" 
                            onChange={(e) => setFormData({...formData, role: e.target.value})}>
                            <option value="Staff">Staff</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Admin">Admin</option>
                        </select>

                        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                            Sign Up
                        </button>
                    </form>
                    <p className="mt-4 text-center text-gray-600">
                        Already have an account? <Link to="/login" className="text-blue-600 font-bold">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;