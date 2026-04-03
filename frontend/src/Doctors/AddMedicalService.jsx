import { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AddMedicalService = () => {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ serviceName: '', rate: '', qty: 1 });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:4000/api/admissions/${id}/add-service`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Service Added Successfully!");
            navigate('/doctor/dashboard');
        } catch (err) { console.log(err); }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-[32px] shadow-sm mt-10">
            <h2 className="text-2xl font-bold mb-6">Add Medical Service</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Service Name</label>
                    <input type="text" className="w-full p-3 bg-gray-50 rounded-xl" placeholder="Consultation, Oxygen, etc." 
                        onChange={(e) => setFormData({...formData, serviceName: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Rate (₹)</label>
                        <input type="number" className="w-full p-3 bg-gray-50 rounded-xl" 
                            onChange={(e) => setFormData({...formData, rate: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Quantity</label>
                        <input type="number" className="w-full p-3 bg-gray-50 rounded-xl" defaultValue={1}
                            onChange={(e) => setFormData({...formData, qty: e.target.value})} required />
                    </div>
                </div>
                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100">
                    Confirm & Update Bill
                </button>
            </form>
        </div>
    );
};

export default AddMedicalService;