const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { createFrontendComponent } = require('./createFrontendComponent'); // Updated path
const logger = require('./logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/execute', async (req, res) => {
  const { command } = req.body;

  if (!command) {
    const msg = '❌ No command provided.';
    logger.warn(msg);
    return res.status(400).json({ error: msg });
  }

  logger.info(`📥 Received command: ${command}`);

  const parts = command.replace('/', '').split(' ');
  const [action, target, type] = parts;

  logger.info(`🔍 Parsed ➤ Action: ${action}, Target: ${target}, Type: ${type}`);

  try {
    if (action === 'create') {
      const componentName = `${target.charAt(0).toUpperCase() + target.slice(1)}${type.charAt(0).toUpperCase() + type.slice(1)}`;
      logger.info(`🛠️ Generating component: ${componentName}.tsx`);

      await createFrontendComponent(componentName);

      logger.info(`✅ Component "${componentName}" generated and committed successfully.`);
      return res.status(200).json({ message: `Component "${componentName}" generated and committed successfully.` });
    } else {
      const msg = `❌ Unknown action "${action}". Only "create" is supported.`;
      logger.warn(msg);
      return res.status(400).json({ error: msg });
    }

  } catch (err) {
    logger.error('🔥 Execution error occurred', err);
    return res.status(500).json({ error: 'Command execution failed.' });
  }
});

app.listen(PORT, () => {
  logger.info(`🧠 Autoflow CommandProcessor running on port ${PORT}`);
});
