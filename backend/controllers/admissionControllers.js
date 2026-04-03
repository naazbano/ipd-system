import Admission from '../models/Admission.js';


export const createAdmission = async (req, res) => {
    try {
        const { patientName, age, gender } = req.body;
        
        const admission = await Admission.create({
            patientName,
            age,
            gender,
            createdBy: req.user._id 
        });

        res.status(201).json(admission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const addService = async (req, res) => {
    try {
        const { serviceName, rate, qty } = req.body;
        const admission = await Admission.findById(req.params.id);

        if (!admission) return res.status(404).json({ message: "Patient not found" });

        // Nayi service add karein
        const newService = { serviceName, rate, qty };
        admission.services.push(newService);

        // Total Bill recalculate karein
        // Formula: Pehla total + (Naya rate * Nayi quantity)
        admission.totalBill = (admission.totalBill || 0) + (Number(rate) * Number(qty));

        await admission.save();
        res.status(200).json(admission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAdmissionById = async (req, res) => {
    try {
        const admission = await Admission.findById(req.params.id)
            .populate('createdBy', 'name')
            .populate('services.addedBy', 'name');
            
        if (!admission) return res.status(404).json({ message: 'Bill not found' });
        res.json(admission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getAllAdmissions = async (req, res) => {
    try {
        
        const admissions = await Admission.find()
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });
            
        res.status(200).json(admissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// admissionController.js

// 1. Update Admission (Admin Only)
export const updateAdmission = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const updatedAdmission = await Admission.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedAdmission) return res.status(404).json({ message: "Record not found" });
        res.status(200).json(updatedAdmission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Delete Admission (Admin Only)
export const deleteAdmission = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const admission = await Admission.findByIdAndDelete(req.params.id);
        if (!admission) return res.status(404).json({ message: "Record not found" });

        res.status(200).json({ message: "Admission record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};