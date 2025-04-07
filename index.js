const express = require('express');
const bodyParser = require('body-parser');
const { createFrontendComponent } = require('./actions/createFrontendComponent');
const setupRepo = require('./setupRepo');

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

  if (action === 'create' && target && type) {
    const fileName = `${target.charAt(0).toUpperCase() + target.slice(1)}${type.charAt(0).toUpperCase() + type.slice(1)}.js`;
    const path = `./gym-components/${fileName}`;

    try {
      console.log(`Generating component: ${fileName} at path: ${path}`);
      await createFrontendComponent(fileName, path);
      res.status(200).json({ message: 'Component generated and pushed successfully.' });
    } catch (err) {
      console.error("Error during generation/push:", err);
      res.status(500).json({ error: 'Generation or push failed.' });
    }
  } else {
    res.status(400).json({ error: 'Invalid command structure.' });
  }
});

app.listen(PORT, async () => {
  console.log(`Command processor running on port ${PORT}`);
  await setupRepo(); // Clones/pulls repo before accepting commands
});
