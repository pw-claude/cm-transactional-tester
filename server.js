if (method === 'api') {
  if (!apiKey || !clientId) {
    throw new Error('API Key and Client ID are required');
  }

  const response = await axios.post(
    `https://api.createsend.com/api/v3.3/transactional/classicEmail/send`,
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
