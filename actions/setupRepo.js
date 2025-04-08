const setupRepo = async () => {
  const simpleGit = require('simple-git');
  const fs = require('fs');
  const os = require('os');
  const path = require('path');

  // Remote URL
  const remote = `https://${process.env.GITHUB_USERNAME}:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}.git`;

  const git = simpleGit();

  // Clone and init
  const tempPath = fs.mkdtempSync(path.join(os.tmpdir(), 'temp-frontend-repo-'));
  console.log(`📦 Cloning ${process.env.GITHUB_REPO} repo...`);
  await git.clone(remote, tempPath);
  console.log('✅ Clone complete.');

  // Init Git (required to fix --local error)
  await git.cwd(tempPath);
  await git.init();
  await git.checkoutLocalBranch('master');

  return tempPath;
};

module.exports = setupRepo;
