const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const logger = require('../utils/logger');

/**
 * Generic function to send WhatsApp messages (Templated or Simple)
 */
const sendWhatsAppMessage = async ({ phone, message, templateName, components, filePath }) => {
    if (!phone) {
        logger.warn('WhatsApp: No phone number provided, skipping.');
        return { success: false, error: 'No phone number' };
    }
    try {
        const FLAXXA_TOKEN = process.env.FLAXXA_TOKEN;
        if (!FLAXXA_TOKEN) {
            logger.warn('WhatsApp token missing, message not sent');
            return { success: false, error: 'Token missing' };
        }

        // Clean phone number (remove spaces, dashes, parens, and plus sign)
        let cleanPhone = String(phone).replace(/[\s\-\(\)\+]/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = '91' + cleanPhone.slice(1);
        // Ensure India prefix if 10 digits
        if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

        const form = new FormData();
        form.append("token", FLAXXA_TOKEN);
        form.append("phone", cleanPhone);

        if (templateName) {
            // Using Template
            form.append("template_name", templateName);
            form.append("template_language", "en");
            if (components) {
                form.append("components", JSON.stringify(components));
            }

            let endpoint = "https://wapi.flaxxa.com/api/v1/sendtemplatemessage";
            
            if (filePath && fs.existsSync(filePath)) {
                endpoint = "https://wapi.flaxxa.com/api/v1/sendtemplatemessage_withattachment";
                form.append("header_attachment", fs.createReadStream(filePath), {
                    filename: "Order_Invoice.pdf",
                    contentType: "application/pdf"
                });
            }

            const response = await axios.post(endpoint, form, {
                headers: form.getHeaders(),
                timeout: 15000
            });
            return response.data;
        } else {
            // Simple Text Message
            // Try multiple known Flaxxa endpoints if needed
            const endpoints = [
                { url: 'https://wapi.flaxxa.com/api/v1/sendmessage', type: 'form' },
                { url: 'https://app.flaxxa.com/api/send-whatsapp-message', type: 'json' }
            ];

            let lastErr;
            for (const ep of endpoints) {
                try {
                    let response;
                    if (ep.type === 'form') {
                        const simpleForm = new FormData();
                        simpleForm.append("token", FLAXXA_TOKEN);
                        simpleForm.append("phone", cleanPhone);
                        simpleForm.append("message", message);
                        response = await axios.post(ep.url, simpleForm, {
                            headers: simpleForm.getHeaders(),
                            timeout: 10000
                        });
                    } else {
                        response = await axios.post(ep.url, {
                            token: FLAXXA_TOKEN,
                            phone: cleanPhone,
                            message: message
                        }, {
                            headers: { 'Content-Type': 'application/json' },
                            timeout: 10000
                        });
                    }
                    
                    if (response.data && (response.data.status === 'success' || response.data.success || response.status === 200)) {
                        logger.info(`WhatsApp message sent successfully via ${ep.url}`);
                        return response.data;
                    }
                } catch (err) {
                    lastErr = err;
                    logger.debug(`Flaxxa endpoint ${ep.url} failed: ${err.message}`);
                }
            }
            throw lastErr || new Error('All WhatsApp endpoints failed');
        }
    } catch (error) {
        const errorData = error?.response?.data;
        const errorMessage = error?.message;
        logger.error('WhatsApp Error:', {
            status: error?.response?.status,
            data: errorData,
            message: errorMessage
        });
        return { success: false, error: errorData || errorMessage };
    }
};

const sendOrderConfirmation = async (order) => {
    const phone = order.customerId?.phone;
    if (!phone) return;

    const message = `Your order #${order.orderNumber} is confirmed 🎉\nEvent Date: ${new Date(order.eventDate).toLocaleDateString('en-IN')}\nTotal: ₹${order.totalAmount.toLocaleString('en-IN')}`;
    
    return await sendWhatsAppMessage({ phone, message });
};

const sendPaymentLinkTemplate = async (phone, amount, paymentLink) => {
    const message = `Pay your pending amount ₹${amount.toLocaleString('en-IN')}:\n${paymentLink}`;
    return await sendWhatsAppMessage({ phone, message });
};

const sendStatusUpdate = async (order, status) => {
    const phone = order.customerId?.phone;
    if (!phone) return;

    const statusMap = {
        'Confirmed': 'Confirmed 🎉',
        'In Preparation': 'In Preparation 🍽️',
        'Ready': 'Ready for Pickup/Delivery ✅',
        'Out for Delivery': 'Out for Delivery 🚚',
        'Delivered': 'Delivered 🎊',
        'Cancelled': 'Cancelled ❌'
    };

    const displayStatus = statusMap[status] || status;
    const message = `Your order #${order.orderNumber} is now ${displayStatus}`;
    
    return await sendWhatsAppMessage({ phone, message });
};

const sendReceiptWhatsapp = async (phone, filePath, donorName, amount, paymentType = "normal") => {
    // Legacy support for existing call in orderController
    const components = [
        {
            type: "body",
            parameters: [
                { type: "text", text: donorName },
                { type: "text", text: String(amount) }
            ]
        }
    ];
    let templateName = paymentType === "subscription" ? "andseva_monthly_success_reciept" : "annadana_acknowledgement_receipt";
    
    return await sendWhatsAppMessage({ phone, templateName, components, filePath });
};

/**
 * Utility to send a templated message (No attachment)
 */
const sendTemplatedMessage = async (phone, templateName, components = []) => {
    return await sendWhatsAppMessage({ phone, templateName, components });
};

/**
 * Utility to send an invoice with PDF attachment using a template
 */
const sendInvoiceWhatsApp = async (phone, filePath, customerName, invoiceNumber) => {
    const components = [
        {
            type: "body",
            parameters: [
                { type: "text", text: customerName },
                { type: "text", text: invoiceNumber }
            ]
        }
    ];
    // This template must be registered in Flaxxa
    const templateName = "invoice_notification"; 
    
    return await sendWhatsAppMessage({ 
        phone, 
        templateName, 
        components, 
        filePath 
    });
};

module.exports = {
    sendWhatsAppMessage,
    sendTemplatedMessage,
    sendInvoiceWhatsApp,
    sendOrderConfirmation,
    sendPaymentLinkTemplate,
    sendStatusUpdate,
    sendReceiptWhatsapp
};
