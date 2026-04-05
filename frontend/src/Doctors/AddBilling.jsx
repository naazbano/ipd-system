

import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { BACKEND_URL } from '../utils/utils';

const GenerateBill = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [admission, setAdmission] = useState(null);
    const [tax, setTax] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(true);
     const { user } = useContext(AuthContext);
    useEffect(() => {
        const fetchAdmissionDetails = async () => {
            try {

                const res = await axios.get(`${BACKEND_URL}/admissions/${id}`);
                setAdmission(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching admission details:", err);
                setLoading(false);
            }
        };
        if (id) fetchAdmissionDetails();
    }, [id]);

    const services = admission?.services || [];
    const subTotal = services.reduce((acc, curr) => acc + (curr.rate * curr.qty), 0);
    const taxAmount = (subTotal * tax) / 100;
    const grandTotal = subTotal + taxAmount - discount;

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        try {
            
            await axios.post(`${BACKEND_URL}/billing/generate`, {
                admissionId: id,
                taxPercent: tax,
                discountAmount: discount
            });
            alert("Final Bill Generated Successfully!");
        
             const role = user?.role?.toLowerCase(); 
            if (role === 'admin') {
                navigate(`/admin/invoice/${id}`);
            } else {
        
                navigate(`/doctor/invoice/${id}`);
            }
        } catch (err) {
            alert("Error generating bill: " + err.response?.data?.message);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold">Loading Admission Details...</div>;
    if (!admission) return <div className="p-10 text-center text-red-500">Admission Record Not Found!</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 bg-gray-50/50 min-h-screen">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 font-bold hover:text-indigo-600 transition">
                <ArrowLeft size={20} /> Back
            </button>
            <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl">
                        {admission.patientName?.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-800">{admission.patientName}</h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Age: {admission.age} | Gender: {admission.gender}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase">Status</p>
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">{admission.status}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-gray-800 mb-6">Services Rendered</h3>
                        <div className="space-y-4">
                            {services.map((s, index) => (
                                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div>
                                        <p className="font-bold text-gray-700">{s.serviceName}</p>
                                        <p className="text-xs text-gray-400">₹{s.rate} x {s.qty}</p>
                                    </div>
                                    <p className="font-black text-gray-800">₹{s.rate * s.qty}</p>
                                </div>
                            ))}
                            {services.length === 0 && <p className="text-gray-400 italic">No services added for this patient.</p>}
                        </div>
                    </div>
                </div>

                
                <div className="bg-white p-8 rounded-[32px] border border-indigo-100 shadow-xl shadow-indigo-50/50 h-fit sticky top-6">
                    <h3 className="text-xl font-black text-gray-800 mb-6">Final Summary</h3>
                    <form onSubmit={handleFinalSubmit} className="space-y-5">
                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase ml-1">Tax (%)</label>
                            <input 
                                type="number" 
                                className="w-full p-4 mt-1 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-bold"
                                value={tax}
                                onChange={(e) => setTax(Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase ml-1">Discount (₹)</label>
                            <input 
                                type="number" 
                                className="w-full p-4 mt-1 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-bold"
                                value={discount}
                                onChange={(e) => setDiscount(Number(e.target.value))}
                            />
                        </div>

                        <div className="pt-4 space-y-3 border-t border-dashed">
                            <div className="flex justify-between font-bold text-gray-500">
                                <span>Subtotal</span>
                                <span>₹{subTotal}</span>
                            </div>
                            <div className="flex justify-between font-black text-gray-800 text-xl pt-2">
                                <span>Grand Total</span>
                                <span>₹{grandTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-lg hover:bg-indigo-700 transition-all mt-4">
                            Save & Generate Bill
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GenerateBill;