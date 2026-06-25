const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/schedule/:depotId', async (req, res) => {
  try {
    const { depotId } = req.params;
    const auth = req.headers.authorization;

    // Fetch depots and vehicles
    const depotRes = await axios.get(
      'http://4.224.186.213/evaluation-service/depots',
      { headers: { Authorization: auth } }
    );

    const vehicleRes = await axios.get(
      'http://4.224.186.213/evaluation-service/vehicles',
      { headers: { Authorization: auth } }
    );

    const depot = depotRes.data.depots.find(d => d.ID == depotId);
    const vehicles = vehicleRes.data.vehicles;
    const budget = depot.MechanicHours;

    // Knapsack - pick max impact within budget hours
    const n = vehicles.length;
    const dp = Array(budget + 1).fill(0);

    for (let v of vehicles) {
      for (let w = budget; w >= v.Duration; w--) {
        dp[w] = Math.max(dp[w], dp[w - v.Duration] + v.Impact);
      }
    }

    res.status(200).json({
      depotId,
      budget,
      maxImpact: dp[budget]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3002, () => console.log('Vehicle scheduler running on 3002'));