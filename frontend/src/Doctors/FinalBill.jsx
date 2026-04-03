import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FinalBill = () => {
    const { id } = useParams();
    const [billData, setBillData] = useState(null);

    useEffect(() => {
        const fetchBill = async () => {
            const res = await axios.get(`http://localhost:4000/api/billing/${id}`);
            setBillData(res.data);
        };
        fetchBill();
    }, [id]);

    if (!billData) return <div className="p-10">No bill found for this patient.</div>;

    return (
        <div className="p-10 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto border-t-8 border-indigo-600 p-10 shadow-2xl rounded-xl">
                <div className="flex justify-between items-center border-b pb-6">
                    <h1 className="text-4xl font-black text-gray-800 italic">INVOICE</h1>
                    <div className="text-right text-gray-500">
                        <p>Hospital Pro Lucknow</p>
                        <p>Date: {new Date(billData.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="py-8">
                    <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest">Patient Details</h3>
                    <p className="text-xl font-bold text-gray-800">{billData.admissionId.patientName}</p>
                </div>

                <table className="w-full mt-6">
                    <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase">
                        <tr>
                            <th className="p-4 text-left">Description</th>
                            <th className="p-4">Qty</th>
                            <th className="p-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {billData.services.map((s, i) => (
                            <tr key={i}>
                                <td className="p-4 text-gray-700 font-medium">{s.serviceName}</td>
                                <td className="p-4 text-center">{s.qty}</td>
                                <td className="p-4 text-right font-bold">₹{s.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-10 flex justify-end">
                    <div className="w-72 bg-indigo-50 p-6 rounded-3xl">
                        <div className="flex justify-between text-indigo-900 font-black text-2xl">
                            <span>Total</span>
                            <span>₹{billData.grandTotal}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinalBill;