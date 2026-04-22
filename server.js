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
    smartEmailId,
    toEmail,
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass
  } = req.body;

  try {
    if (method === 'api') {
      const response = await axios.post(
        `https://api.createsend.com/api/v3.3/transactional/smartEmail/${smartEmailId}/send`,
        {
          To: toEmail,
          Data: {}
        },
        {
          auth: { username: apiKey, password: 'x' }
        }
      );

      return res.json({ success: true, response: response.data });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: false,
      auth: { user: smtpUser, pass: smtpPass }
    });

    const info = await transporter.sendMail({
      from: smtpUser,
      to: toEmail,
      subject: 'Test Email',
      text: 'SMTP test email'
    });

    res.json({ success: true, response: info });

  } catch (err) {
    res.json({
      success: false,
      error: err.response?.data || err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running on port', PORT));