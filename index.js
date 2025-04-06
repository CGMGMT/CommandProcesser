try {
  await setupRepo();

  const normalized = command.trim().replace(/^\/+/, '/');

  switch (normalized) {
    case '/create dashboard frontend': {
      const componentName = 'Dashboard';
      await createFrontendComponent(componentName, REPO_DIR);
      await git.add('./*');
      await git.commit(`Add ${componentName} component`);
      await git.push('origin', 'main');
      return res.status(200).json({ message: `${componentName} component created and pushed.` });
    }

    // Add more cases below ⬇️
    case '/create docs page': {
      // example placeholder
      return res.status(200).json({ message: 'Docs page command recognized (add logic next).' });
    }

    default:
      return res.status(400).json({ error: 'Unsupported command.' });
  }
} catch (err) {
  console.error(err);
  return res.status(500).json({ error: 'Failed to execute command.' });
}
