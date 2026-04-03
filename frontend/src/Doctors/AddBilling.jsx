import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ReceiptIndianRupee, ArrowLeft, Plus } from 'lucide-react';

const AddBilling = () => {
    const { id } = useParams(); // Admission ID
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [service, setService] = useState({ serviceName: '', rate: '', qty: 1 });

    useEffect(() => {
      
        const fetchPatient = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/api/admissions/${id}`);
                setPatient(res.data);
            } catch (err) { console.log(err); }
        };
        fetchPatient();
    }, [id]);

    const handleBillingSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/api/billing/add', {
                admissionId: id,
                ...service
            });
            alert("Service added to bill successfully!");
            navigate(`/doctor/invoice/${id}`); // Bill add hone ke baad invoice dikhao
        } catch (err) {
            alert("Error adding bill");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 font-semibold">
                <ArrowLeft size={20} /> Back to List
            </button>

            {patient && (
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                            {patient.patientName.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{patient.patientName}</h2>
                            <p className="text-sm text-gray-400">ID: {id.slice(-6).toUpperCase()}</p>
                        </div>
                    </div>
                    <div className="text-right text-blue-600 font-bold">
                        Status: <span className="bg-blue-50 px-3 py-1 rounded-full text-xs">Active Admission</span>
                    </div>
                </div>
            )}

         
            <div className="bg-white rounded-[32px] shadow-xl p-10 border border-gray-50">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                        <ReceiptIndianRupee size={24} />
                    </div>
                    <h1 className="text-2xl font-black text-gray-800">Add Billing Item</h1>
                </div>

                <form onSubmit={handleBillingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-600 ml-1">Service/Item Name</label>
                            <input 
                                type="text" 
                                placeholder="Consultation, Medicine, X-Ray..."
                                className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                                onChange={(e) => setService({...service, serviceName: e.target.value})}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-600 ml-1">Rate (₹)</label>
                            <input 
                                type="number" 
                                placeholder="500"
                                className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                                onChange={(e) => setService({...service, rate: e.target.value})}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-sm font-bold text-gray-600 ml-1">Quantity</label>
                            <input 
                                type="number" 
                                min="1"
                                defaultValue="1"
                                className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                                onChange={(e) => setService({...service, qty: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[20px] font-bold text-lg shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                        <Plus size={20} /> Add to Patient Bill
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddBilling;