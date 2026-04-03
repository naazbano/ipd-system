import mongoose from 'mongoose';

const billingSchema = new mongoose.Schema({
    admissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admission', required: true },
    services: [{
        serviceName: String,
        rate: Number,
        qty: Number,
        total: Number
    }],
    subTotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('Billing', billingSchema);