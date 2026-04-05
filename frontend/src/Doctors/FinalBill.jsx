
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Download, ArrowLeft, Loader2 } from 'lucide-react';
import { BACKEND_URL } from '../utils/utils';


const FinalBill = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [billData, setBillData] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const invoiceRef = useRef(null);

    useEffect(() => {
        const fetchBill = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/billing/get-bill/${id}`);
                setBillData(res.data);
            } catch (err) {
                console.error("Error fetching bill:", err);
            }
        };
        fetchBill();
    }, [id]);


    const handleDownloadPDF = () => {
        setIsDownloading(true);
        
        
        const downloadUrl = `${BACKEND_URL}/billing/download-pdf/${id}`;
        
        window.open(downloadUrl, '_blank');
 
        
        setTimeout(() => {
            setIsDownloading(false);
        }, 2000);
    };

    if (!billData) return <div className="p-10 text-center font-bold">Loading Invoice...</div>;

    const servicesList = billData.admissionId?.services || [];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 font-bold hover:text-indigo-600">
                    <ArrowLeft size={20} /> Back
                </button>
                
                <button 
                    onClick={handleDownloadPDF} 
                    disabled={isDownloading}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold shadow-lg transition all ${
                        isDownloading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                    {isDownloading ? (
                        <><Loader2 className="animate-spin" size={20} /> Generating...</>
                    ) : (
                        <><Download size={20} /> Download PDF</>
                    )}
                </button>
            </div>

            
            <div 
                ref={invoiceRef} 
                className="max-w-4xl mx-auto bg-white border-t-8 border-indigo-600 p-10 shadow-2xl rounded-xl"
                style={{ fontFamily: 'sans-serif' }} 
            >
                {/* Header Section */}
                <div className="flex justify-between items-start border-b pb-8">
                    <div>
                        <h1 className="text-4xl font-black text-gray-800 tracking-tighter italic uppercase">Invoice</h1>
                        <p className="text-indigo-600 font-bold mt-1">HOSPITAL PRO LUCKNOW</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Bill Date</p>
                        <p className="font-bold text-gray-700">{new Date(billData.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                </div>

        
                <div className="py-8">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Bill To:</h3>
                    <p className="text-2xl font-black text-gray-800">{billData.admissionId?.patientName}</p>
                    <p className="text-sm font-bold text-gray-500 italic">
                        Age: {billData.admissionId?.age} | Gender: {billData.admissionId?.gender}
                    </p>
                </div>

                {/* Table */}
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b-2 border-gray-100 text-xs font-black text-gray-400 uppercase tracking-wider">
                            <th className="py-4">Service</th>
                            <th className="py-4 text-center">Qty</th>
                            <th className="py-4 text-right">Price</th>
                            <th className="py-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {servicesList.map((s, i) => (
                            <tr key={i} className="text-gray-700">
                                <td className="py-4 font-bold">{s.serviceName}</td>
                                <td className="py-4 text-center">{s.qty}</td>
                                <td className="py-4 text-right">₹{s.rate}</td>
                                <td className="py-4 text-right font-black">₹{s.rate * s.qty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="mt-10 pt-6 border-t flex justify-end">
                    <div className="w-72 space-y-3">
                        <div className="flex justify-between text-gray-500 font-bold">
                            <span>Subtotal</span>
                            <span>₹{billData.subTotal}</span>
                        </div>
                        <div className="flex justify-between text-red-500 font-bold text-sm">
                            <span>Discount</span>
                            <span>- ₹{billData.discount}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-2xl text-indigo-900 font-black text-2xl mt-4">
                            <span>Grand Total</span>
                            <span>₹{billData.grandTotal}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinalBill;