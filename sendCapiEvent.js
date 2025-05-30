const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors'); // ✅ Required for CORS fix
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // ✅ Enable CORS
app.use(express.json());


app.post('/send-capi', async (req, res) => {
  const {
    event_name,
    event_id,
    value,
    currency,
    content_name,
    content_category,
    event_source_url,
    user_agent
  } = req.body;

  const pixelId = '1343687880256380';
  const accessToken = 'EAAIO31lCSzkBO8MYhqTN4jSaTmRzWkpiZBhBGZBZBm9uxWZAms2tur7kqvMSuhbbbnHbVkUynLBJfCnZCzqEVxOOkvtdWujEZBHaoQmZAC6ThRdPL9XTiLCSS2NzJmztjJasTVu1JBxk1VxPNv1CmqzfRZC1t58P6hmZCnUt7bHZCXOy0MjYJBizSzgS9LBxGZCtTgQ7wZDZD';

  const payload = {
    data: [
      {
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id,
        action_source: "website",
        event_source_url,
        user_data: {
          client_user_agent: user_agent
        },
        custom_data: {
          value,
          currency,
          content_name,
          content_category
        }
      }
    ]
  };

  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    res.status(200).json({ success: true, response: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
