const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_USER !== 'ethereal_user') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

const sendNotificationEmail = async ({ name, email, phone, company, subject, message, relatedProductTitle }) => {
  const receiver = process.env.NOTIFICATION_RECEIVER_EMAIL || process.env.ADMIN_EMAIL || 'admin@devstudio.com';

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; padding: 6px 16px; border-radius: 20px; font-weight: 600; font-size: 14px;">
          New Portfolio Enquiry
        </span>
      </div>
      
      <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-bottom: 16px;">
        ${subject || 'New Contact Form Submission'}
      </h2>

      <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #cbd5e1; margin-bottom: 20px;">
        <p style="margin: 8px 0; color: #334155;"><strong>Name:</strong> ${name}</p>
        <p style="margin: 8px 0; color: #334155;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        ${phone ? `<p style="margin: 8px 0; color: #334155;"><strong>Phone:</strong> ${phone}</p>` : ''}
        ${company ? `<p style="margin: 8px 0; color: #334155;"><strong>Company:</strong> ${company}</p>` : ''}
        ${relatedProductTitle ? `<p style="margin: 8px 0; color: #4f46e5;"><strong>Interested Product:</strong> ${relatedProductTitle}</p>` : ''}
        <p style="margin: 8px 0; color: #334155;"><strong>Date/Time:</strong> ${new Date().toLocaleString()}</p>
      </div>

      <div style="background: #ffffff; padding: 20px; border-radius: 12px; border-left: 4px solid #4f46e5;">
        <h3 style="margin-top: 0; color: #1e293b; font-size: 15px;">Message Content:</h3>
        <p style="color: #475569; white-space: pre-wrap; line-height: 1.6; margin-bottom: 0;">${message}</p>
      </div>

      <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 12px;">
        Sent via Portfolio Digital Products Showcase API System
      </div>
    </div>
  `;

  const transporter = createTransporter();

  if (!transporter) {
    console.log('\n==================================================');
    console.log(' [EMAIL SIMULATION] (SMTP credentials not configured)');
    console.log(` To: ${receiver}`);
    console.log(` From: ${name} <${email}>`);
    console.log(` Subject: ${subject}`);
    console.log(` Message: ${message}`);
    console.log('==================================================\n');
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${name} via DevStudio" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: receiver,
      subject: `[Portfolio Enquiry] ${subject}`,
      html: htmlContent,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Mailer Error] Failed to send email via SMTP:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendNotificationEmail };
