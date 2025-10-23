import formData from 'form-data';
import Mailgun from 'mailgun.js';
import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

// Check if variables exist
if (!process.env.MAILGUN_API_KEY) {
  throw new Error('MAILGUN_API_KEY environment variable is required');
}

if (!process.env.MAILGUN_DOMAIN) {
  throw new Error('MAILGUN_DOMAIN environment variable is required');
}

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    const msg = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `Maison Sommeil <postmaster@${process.env.MAILGUN_DOMAIN}>`,
      to: [to],
      subject: subject,
      text: text,
      html: html,
    });
    
    console.log('Email sent successfully:', msg);
    return msg;
  } catch (error) {
    console.error('Mailgun error:', error);
    throw error;
  }
};