const express = require('express');
const git = require('simple-git')();
const { createFrontendComponent } = require('./actions/createFrontendComponent');
const { setupRepo, REPO_DIR } = require('./actions/setupRepo');

const app = express();
app.use(express.json());

app.post('/execute', async (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'Command is required.' });
  }

  try {
    await setupRepo();
    console.log('Received command:', command); // Log the command

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
    console.error(err);
    return res.status(500).json({ error: 'Failed to execute command.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
