const express = require('express');
const bodyParser = require('body-parser');
const { createFrontendComponent } = require('./actions/createFrontendComponent');
const setupRepo = require('./actions/setupRepo');
const logger = require('./logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/execute', async (req, res) => {
  const { command } = req.body;

  if (!command) {
    logger.warn('⚠️ No command provided in request.');
    return res.status(400).json({ error: 'No command provided.' });
  }

  logger.info(`📥 Received command: ${command}`);

  const parts = command.replace('/', '').split(' ');
  const [action, target, type] = parts;

  logger.info(`🔍 Parsed ➤ Action: ${action}, Target: ${target}, Type: ${type}`);

  try {
    await setupRepo();
    logger.info('📦 Repo setup complete.');

    if (action === 'create') {
      const componentName = `${target.charAt(0).toUpperCase() + target.slice(1)}${type.charAt(0).toUpperCase() + type.slice(1)}`;
      logger.info(`🛠️ Generating component: ${componentName}.tsx`);

      await createFrontendComponent(componentName, './temp-frontend-repo');
      logger.info(`✅ Component ${componentName} created and committed.`);

      return res.status(200).json({ message: 'Component generated and committed successfully.' });
    }

    logger.warn(`❌ Unknown action: ${action}`);
    res.status(400).json({ error: 'Unknown action.' });

  } catch (err) {
    logger.error('🔥 Execution error occurred', { error: err.stack });
    res.status(500).json({ error: 'Command execution failed.' });
  }
});

app.listen(PORT, () => {
  logger.info(`🧠 Autoflow CommandProcessor running on port ${PORT}`);
});
