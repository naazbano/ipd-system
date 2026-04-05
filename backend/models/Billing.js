import mongoose from 'mongoose';

const billingSchema = new mongoose.Schema({
    admissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admission', required: true },
    subTotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 }, // Percentage mein (e.g. 10 for 10%)
    discount: { type: Number, default: 0 }, // Amount mein
    grandTotal: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('Billing', billingSchema);