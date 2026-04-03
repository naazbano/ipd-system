
import Billing from '../models/Billing.js';
import Admission from '../models/Admission.js'; // 1. Admission model import karein

export const addServiceToBill = async (req, res) => {
    try {
        const { admissionId, serviceName, rate, qty } = req.body;
        const lineTotal = Number(rate) * Number(qty);

        // --- PART 1: Billing Table Update ---
        let bill = await Billing.findOne({ admissionId });
        if (!bill) {
            bill = new Billing({ admissionId, services: [] });
        }
        bill.services.push({ serviceName, rate, qty, total: lineTotal });
        bill.subTotal = bill.services.reduce((acc, curr) => acc + curr.total, 0);
        bill.grandTotal = bill.subTotal;
        await bill.save();

        // --- PART 2: Admission Table Update (Automatic) ---
        // Hum Admission record dhundhenge aur uski 'services' array mein ye naya data push karenge
        await Admission.findByIdAndUpdate(
            admissionId,
            { 
                $push: { 
                    services: { 
                        serviceName, 
                        price: rate, // Agar Admission model mein 'price' field hai
                        date: new Date() 
                    } 
                } 
            },
            { new: true }
        );

        res.status(200).json({ message: "Bill and Admission updated!", bill });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Admission ID se bill get karne ka logic
export const getBillByAdmission = async (req, res) => {
    try {
        const bill = await Billing.findOne({ admissionId: req.params.id }).populate('admissionId');
        if (!bill) return res.status(404).json({ message: "Bill not found" });
        res.status(200).json(bill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};