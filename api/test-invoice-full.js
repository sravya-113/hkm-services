const { generateInvoicePDF } = require('./src/services/pdfService');
const { sendInvoiceWhatsApp } = require('./src/services/whatsappService');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const testInvoiceFull = async () => {
    // 1. Mock Invoice Data
    const mockInvoice = {
        invoiceNumber: 'INV-TEST-99',
        date: new Date(),
        subTotal: 1000,
        taxRate: 5,
        taxAmount: 50,
        discountAmount: 0,
        totalAmount: 1050,
        amountPaid: 0,
        balance: 1050,
        status: 'Unpaid',
        lineItems: [
            { name: 'Traditional Thali', qty: 2, unitPrice: 500, total: 1000 }
        ]
    };
    
    const mockCustomer = {
        name: 'Lasya Test',
        company: 'Test Corp',
        phone: '8247806856',
        email: 'test@example.com'
    };

    console.log('--- Phase 1: Generating PDF ---');
    try {
        const buffer = await generateInvoicePDF(mockInvoice, mockCustomer);
        const testPath = path.join(__dirname, 'test-invoice.pdf');
        fs.writeFileSync(testPath, buffer);
        console.log('✅ PDF generated successfully: test-invoice.pdf');

        console.log('\n--- Phase 2: Sending via WhatsApp Template ---');
        console.log(`Target Number: ${mockCustomer.phone}`);
        
        const result = await sendInvoiceWhatsApp(
            mockCustomer.phone,
            testPath,
            mockCustomer.name,
            mockInvoice.invoiceNumber
        );

        console.log('Result:', JSON.stringify(result, null, 2));
        
        if (result.success || result.status === 'success') {
            console.log('✅ WhatsApp Template & PDF sent successfully!');
        } else {
            console.log('❌ WhatsApp sending failed. Check your Flaxxa template name "invoice_notification".');
        }

        // Cleanup
        // fs.unlinkSync(testPath);
    } catch (error) {
        console.error('❌ Test Failed:', error);
    }
};

testInvoiceFull();
