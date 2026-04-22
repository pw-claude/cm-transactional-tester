const express = require('express');
const axios = require('axios');
const nodemailer = require('nodemailer');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/send', async (req, res) => {
  const {
    method,
    apiKey,
    clientId,
    fromEmail,
    toEmail,
    subject,
    content,
    smtpHost,
    smtpPort,
    smtpUser,
    smtpToken
  } = req.body;

  try {
    // =========================
    // API: Classic Transactional
    // =========================
    if (method === 'api') {
      if (!apiKey || !clientId) {
        throw new Error('API Key and Client ID are required');
      }

      const response = await axios.post(
        `https://api.createsend.com/api/v3.3/transactional/classic/send`,
        {
          ClientID: clientId,
          To: toEmail,
          From: fromEmail,
          Subject: subject,
          Html: content,
          Text: content
        },
        {
          auth: {
            username: apiKey,
            password: 'x'
          }
        }
      );

      return res.json({
        success: true,
        type: 'API',
        response: response.data
      });
    }

    // =========================
    // SMTP
    // =========================
    if (method === 'smtp') {
      if (!smtpUser || !smtpToken) {
        throw new Error('SMTP Username and Token required');
      }

      const transporter = nodemailer.createTransport({
        host: smtpHost || 'smtp.createsend.com',
        port: Number(smtpPort) || 587,
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpToken
        }
      });

      const info = await transporter.sendMail({
        from: fromEmail,
        to: toEmail,
        subject: subject,
        html: content,
        text: content
      });

      return res.json({
        success: true,
        type: 'SMTP',
        response: info
      });
    }

    throw new Error('Invalid method');
  } catch (err) {
    return res.json({
      success: false,
      error: err.response?.data || err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running on port', PORT));
