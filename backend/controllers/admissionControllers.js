import Admission from '../models/Admission.js';


export const createAdmission = async (req, res) => {
    try {
        const { patientName, age, gender , status} = req.body;
        
        const admission = await Admission.create({
            patientName,
            age,
            gender,
            status,
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
        if (!admission) return res.status(404).json({ message: "Admission not found" });

        const lineTotal = Number(rate) * Number(qty);
        
      
        admission.services.push({ serviceName, rate, qty, total: lineTotal });
        
        
        admission.totalBill = (admission.totalBill || 0) + lineTotal;

        await admission.save();
        res.status(200).json({ message: "Service added to Admission", admission });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getServices = async (req, res) => {
    try {
        const admission = await Admission.findById(req.params.id).select('services patientName');
        
        if (!admission) {
            return res.status(404).json({ message: "Admission record not found" });
        }

        
        res.status(200).json({
            patientName: admission.patientName,
            services: admission.services
        });
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
        const admissions = await Admission.aggregate([
            {
            
                $lookup: {
                    from: "billings", 
                    localField: "_id",
                    foreignField: "admissionId",
                    as: "billInfo"
                }
            },
            {
            
                $addFields: {
                    grandTotal: { 
                        $ifNull: [{ $arrayElemAt: ["$billInfo.grandTotal", 0] }, 0] 
                    }
                }
            },
            {
            
                $sort: { createdAt: -1 }
            }
        ]);

        res.status(200).json(admissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const updateService = async (req, res) => {
    try {
        const { admissionId, serviceId } = req.params;
        const { serviceName, rate, qty } = req.body;

        const admission = await Admission.findOneAndUpdate(
            { _id: admissionId, "services._id": serviceId },
            {
                $set: {
                    "services.$.serviceName": serviceName,
                    "services.$.rate": rate,
                    "services.$.qty": qty,
                    "services.$.updatedAt": Date.now()
                }
            },
            { new: true }
        );

        if (!admission) {
            return res.status(404).json({ message: "Service or Admission not found" });
        }

        res.status(200).json({ message: "Service updated successfully", admission });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const deleteService = async (req, res) => {
    const { admissionId, serviceId } = req.params;
    try {
        const admission = await Admission.findById(admissionId);
        if (!admission) return res.status(404).json({ message: "Admission not found" });

        
        admission.services.pull({ _id: serviceId });
        await admission.save();

        res.status(200).json({ message: "Service removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};