require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');
const { createFrontendComponent } = require('./actions/createFrontendComponent');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const REPO_DIR = path.join(__dirname, 'repos', process.env.GITHUB_REPO);
const REPO_URL = `https://${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}.git`;
const git = simpleGit(REPO_DIR);

async function setupRepo() {
  if (!fs.existsSync(REPO_DIR)) {
    fs.mkdirSync(REPO_DIR, { recursive: true });
    await git.clone(REPO_URL, REPO_DIR);
  }
}

app.post('/execute', async (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'Command is required.' });
  }

  try {
    await setupRepo();

    if (command.startsWith('//create dashboard frontend')) {
      const componentName = 'Dashboard';
      await createFrontendComponent(componentName, REPO_DIR);

      await git.add('./*');
      await git.commit(`Add ${componentName} component`);
      await git.push('origin', 'main');

      return res.status(200).json({ message: `${componentName} component created and pushed.` });
    }

    res.status(400).json({ error: 'Unsupported command.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to execute command.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
