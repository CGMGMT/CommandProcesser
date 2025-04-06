const express = require('express');
const bodyParser = require('body-parser');
const simpleGit = require('simple-git');
const createFrontendComponent = require('./actions/createFrontendComponent');
const setupRepo = require('./actions/setupRepo');

const app = express();
const PORT = process.env.PORT || 3000;
const git = simpleGit();
const REPO_DIR = '.';

app.use(bodyParser.json());

app.post('/execute', async (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'Command is required.' });
  }

  console.log('📥 Received command:', command);

  try {
    await setupRepo();

    if (command.trim() === '//create dashboard frontend') {
      const componentName = 'Dashboard';
      await createFrontendComponent(componentName, REPO_DIR);

      await git.add('./*');
      await git.commit(`Add ${componentName} component`);
      await git.push('origin', 'main');

      return res.status(200).json({ message: `${componentName} component created and pushed.` });
    }

    return res.status(400).json({ error: 'Unsupported command.' });
  } catch (err) {
    console.error('🔥 Error while executing command:', err);
    res.status(500).json({ error: 'Failed to execute command.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Command processor listening on port ${PORT}`);
});
