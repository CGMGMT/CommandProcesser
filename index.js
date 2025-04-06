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
