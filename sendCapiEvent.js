const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
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
    user_agent,
    user_data // optional
  } = req.body;

  // ✅ Basic validation
  if (!event_name || !event_id || !value || !currency) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields (event_name, event_id, value, currency)"
    });
  }

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
          ...user_data,
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

    if (!response.ok) {
      console.error("❌ Facebook API Error:", result);
      return res.status(500).json({ success: false, response: result });
    }

    res.status(200).json({ success: true, response: result });

  } catch (error) {
    console.error("❌ Server Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
