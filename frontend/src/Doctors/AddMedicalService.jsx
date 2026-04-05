

import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BACKEND_URL } from '../utils/utils';
const AddMedicalService = () => {
    
    const { id, serviceId } = useParams(); 
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ serviceName: '', rate: '', qty: 1 });
    const isEditMode = !!serviceId; 

    
    useEffect(() => {
        if (isEditMode) {
            const fetchServiceData = async () => {
                try {
                    const res = await axios.get(`${BACKEND_URL}/admissions/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    const service = res.data.services.find(s => s._id === serviceId);
                    if (service) {
                        setFormData({
                            serviceName: service.serviceName,
                            rate: service.rate,
                            qty: service.qty
                        });
                    }
                } catch (err) {
                    console.error("Error fetching service details", err);
                }
            };
            fetchServiceData();
        }
    }, [id, serviceId, isEditMode, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isEditMode 
                ? `${BACKEND_URL}/admissions/${id}/service/${serviceId}` 
                : `${BACKEND_URL}/admissions/${id}/add-service`;        
            
            const method = isEditMode ? 'put' : 'patch';

            await axios[method](url, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(isEditMode ? "Service Updated!" : "Service Added!");
            navigate('/admin/all-admissions'); 
        } catch (err) {
            console.log(err);
            alert("Operation failed");
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-[32px] shadow-sm mt-10">
            <h2 className="text-2xl font-bold mb-6">
                {isEditMode ? 'Update Medical Service' : 'Add Medical Service'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Service Name</label>
                    <input 
                        type="text" 
                        className="w-full p-3 bg-gray-50 rounded-xl" 
                        value={formData.serviceName}
                        onChange={(e) => setFormData({...formData, serviceName: e.target.value})} 
                        required 
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Rate (₹)</label>
                        <input 
                            type="number" 
                            className="w-full p-3 bg-gray-50 rounded-xl" 
                            value={formData.rate}
                            onChange={(e) => setFormData({...formData, rate: e.target.value})} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Quantity</label>
                        <input 
                            type="number" 
                            className="w-full p-3 bg-gray-50 rounded-xl" 
                            value={formData.qty}
                            onChange={(e) => setFormData({...formData, qty: e.target.value})} 
                            required 
                        />
                    </div>
                </div>
                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold">
                    {isEditMode ? 'Save Changes' : 'Confirm & Update Bill'}
                </button>
            </form>
        </div>
    );
};

export default AddMedicalService;