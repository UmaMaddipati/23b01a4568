const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const weights = { Placement: 3, Result: 2, Event: 1 };

app.get('/notifications/top', async (req, res) => {
  try {
    const response = await axios.get(
      'http://4.224.186.213/evaluation-service/notifications',
      { headers: { Authorization: req.headers.authorization } }
    );

    const notifications = response.data.notifications;

    const scored = notifications.map(n => ({
      ...n,
      score: (weights[n.Type] || 0) * 10 +
             new Date(n.Timestamp).getTime() / 1e12
    }));

    const top10 = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.status(200).json({ topNotifications: top10 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('Notification app running on 3001'));