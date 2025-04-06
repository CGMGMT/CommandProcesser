const express = require('express');
const bodyParser = require('body-parser');
const { createFrontendComponent } = require('./actions/createFrontendComponent');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const commands = {
  "/create dashboard frontend": async () => {
    await createFrontendComponent("Dashboard", "./test-repo");
  },
};

app.post('/execute', async (req, res) => {
  const { command } = req.body;

  console.log(`Received command: ${command}`);

  const handler = commands[command];
  if (!handler) {
    return res.status(400).json({ error: "Failed to execute command." });
  }

  try {
    await handler();
    res.status(200).json({ message: "Command executed successfully." });
  } catch (err) {
    console.error("Error executing command:", err);
    res.status(500).json({ error: "Command execution failed." });
  }
});

app.listen(PORT, () => {
  console.log(`Command processor running on port ${PORT}`);
});
