const express = require('express');
const git = require('simple-git')();
const setupRepo = require('./actions/setupRepo');
const createFrontendComponent = require('./actions/createFrontendComponent');

const app = express();
app.use(express.json());

const REPO_DIR = '.';

app.post('/execute', async (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'Command is required.' });
  }

  try {
    console.log(`Executing command: ${command}`);
    await setupRepo();

    if (command.trim() === '/create dashboard frontend') {
      const componentName = 'Dashboard';
      await createFrontendComponent(componentName, REPO_DIR);

      await git.add('./*');
      await git.commit(`Add ${componentName} component`);
      await git.push('origin', 'main');

      return res.status(200).json({ message: `${componentName} component created and pushed.` });
    }

    return res.status(400).json({ error: 'Unsupported command.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to execute command.' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
