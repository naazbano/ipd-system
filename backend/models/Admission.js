import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    serviceName: { type: String, required: true },
    rate: { type: Number, required: true, min: [1, 'Rate must be greater than 0'] },
    qty: { type: Number, required: true, min: [1, 'Qty must be greater than 0'] },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const admissionSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    admissionDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Admitted', 'Discharged'], default: 'Admitted' },
    
    services: [serviceSchema],


    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

n
admissionSchema.pre('save', async function () {
    const serviceNames = this.services.map(s => s.serviceName.toLowerCase());
    const hasDuplicate = serviceNames.some((name, index) => serviceNames.indexOf(name) !== index);
    
    if (hasDuplicate) {
        throw new Error('Duplicate services are not allowed in one admission.');
    }
   
});
export default mongoose.model('Admission', admissionSchema);