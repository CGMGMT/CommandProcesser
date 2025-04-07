const express = require('express');
const bodyParser = require('body-parser');
const { createFrontendComponent } = require('./actions/createFrontendComponent');
const setupRepo = require('./actions/setupRepo'); // ✅ Corrected import path

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/execute', async (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'No command provided.' });
  }

  console.log(`Received command: ${command}`);

  const parts = command.replace('/', '').split(' ');
  const [action, target, type] = parts;

  console.log(`Parsed command ➤ Action: ${action}, Target: ${target}, Type: ${type}`);

  try {
    await setupRepo(); // Clone/pull the frontend repo

    if (action === 'create') {
      const componentName = `${target.charAt(0).toUpperCase() + target.slice(1)}${type.charAt(0).toUpperCase() + type.slice(1)}`;
      console.log(`Generating component: ${componentName}.tsx`);

      await createFrontendComponent(componentName, './temp-repo'); // Output path used in setupRepo
      return res.status(200).json({ message: 'Component generated and committed successfully.' });
    }

    res.status(400).json({ error: 'Unknown action.' });
  } catch (err) {
    console.error('Execution error:', err);
    res.status(500).json({ error: 'Command execution failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`🧠 Autoflow CommandProcessor running on port ${PORT}`);
});
