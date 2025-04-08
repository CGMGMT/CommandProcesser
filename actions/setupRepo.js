const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');

const setupRepo = async () => {
  const tempPath = './temp-frontend-repo';

  // Clean up old clone
  if (fs.existsSync(tempPath)) {
    fs.rmSync(tempPath, { recursive: true });
  }

  // Load credentials
  const { GITHUB_USERNAME, GITHUB_REPO, GITHUB_TOKEN } = process.env;

  if (!GITHUB_USERNAME || !GITHUB_REPO || !GITHUB_TOKEN) {
    throw new Error('Missing GitHub credentials in environment variables');
  }

  // ✅ Clean URL without trailing slash
  const remote = `https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git`;

  const git = simpleGit();

  console.log(`📦 Cloning ${GITHUB_REPO} repo...`);
  await git.clone(remote, tempPath);
  console.log('✅ Clone complete.');
};

module.exports = setupRepo;
