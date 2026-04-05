import puppeteer from 'puppeteer-core'; 
import Billing from '../models/Billing.js';
import Admission from '../models/Admission.js';


export const getBillByAdmission = async (req, res) => {
    try {
        const bill = await Billing.findOne({ admissionId: req.params.id })
            .populate('admissionId'); 
        
        if (!bill) return res.status(404).json({ message: "Bill not found" });

        res.status(200).json(bill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const downloadInvoicePDF = async (req, res) => {
    try {
        const { id } = req.params;
        const bill = await Billing.findOne({ admissionId: id }).populate('admissionId');

        if (!bill) return res.status(404).json({ message: "Bill not found" });

        const browser = await puppeteer.launch({
            headless: "new",
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #333; }
                    .header { display: flex; justify-content: space-between; border-bottom: 3px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px; }
                    .invoice-label { font-size: 32px; font-weight: bold; color: #1e1b4b; }
                    .hospital-info { text-align: right; font-size: 14px; color: #666; }
                    .patient-box { background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 30px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background: #4f46e5; color: white; padding: 12px; text-align: left; text-transform: uppercase; font-size: 13px; }
                    td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
                    .total-box { margin-top: 40px; float: right; width: 250px; }
                    .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-weight: bold; }
                    .grand-total { font-size: 20px; color: #4f46e5; border-top: 2px solid #4f46e5; padding-top: 10px; margin-top: 10px; }
                    .footer { margin-top: 100px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px dashed #cbd5e1; pt: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <div class="invoice-label">INVOICE</div>
                        <div style="color: #4f46e5; font-weight: bold;">Hospital Pro Lucknow</div>
                    </div>
                    <div class="hospital-info">
                        <p>Date: ${new Date(bill.createdAt).toLocaleDateString('en-IN')}</p>
                        <p>Invoice #: ${bill._id.toString().slice(-6).toUpperCase()}</p>
                    </div>
                </div>
                <div class="patient-box">
                    <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold;">Bill To:</div>
                    <div style="font-size: 20px; font-weight: bold; margin: 5px 0;">${bill.admissionId.patientName}</div>
                    <div style="font-size: 14px; color: #475569;">Age: ${bill.admissionId.age} | Gender: ${bill.admissionId.gender}</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th style="text-align: center;">Qty</th>
                            <th style="text-align: right;">Rate</th>
                            <th style="text-align: right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bill.admissionId.services.map(s => `
                            <tr>
                                <td style="font-weight: 600;">${s.serviceName}</td>
                                <td style="text-align: center;">${s.qty}</td>
                                <td style="text-align: right;">₹${s.rate}</td>
                                <td style="text-align: right; font-weight: bold;">₹${s.rate * s.qty}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="total-box">
                    <div class="total-row" style="color: #64748b;">
                        <span>Subtotal</span>
                        <span>₹${bill.subTotal}</span>
                    </div>
                    <div class="total-row" style="color: #ef4444;">
                        <span>Discount</span>
                        <span>- ₹${bill.discount || 0}</span>
                    </div>
                    <div class="total-row grand-total">
                        <span>Grand Total</span>
                        <span>₹${bill.grandTotal}</span>
                    </div>
                </div>
                <div class="footer">
                    <p>This is a computer-generated document. No signature required.</p>
                </div>
            </body>
            </html>
        `;

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ 
            format: 'A4', 
            printBackground: true,
            margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' }
        });

        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="Invoice_${bill.admissionId.patientName}.pdf"`,
            'Content-Length': pdfBuffer.length,
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error("Puppeteer Error:", error);
        res.status(500).json({ message: "Failed to generate PDF" });
    }
};



export const generateFinalBill = async (req, res) => {
    try {
        const { admissionId, taxPercent, discountAmount } = req.body;

    
        const admission = await Admission.findById(admissionId);
        if (!admission) return res.status(404).json({ message: "Admission record not found" });

        
        const subTotal = admission.services.reduce((acc, curr) => acc + (curr.rate * curr.qty), 0);

    
        const taxAmount = (subTotal * (Number(taxPercent) || 0)) / 100;
        const grandTotal = subTotal + taxAmount - (Number(discountAmount) || 0);

        
        const bill = await Billing.findOneAndUpdate(
            { admissionId },
            {
                subTotal,
                tax: taxPercent,
                discount: discountAmount,
                grandTotal,
                status: 'Pending'
            },
            { new: true, upsert: true } 
        );

        res.status(200).json({ message: "Final Bill Generated", bill });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
