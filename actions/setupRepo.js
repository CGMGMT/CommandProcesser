const simpleGit = require('simple-git');
const fs = require('fs');
require('dotenv').config();

const setupRepo = async () => {
  const tempPath = './temp-frontend-repo';

  // Clean up if the folder already exists
  if (fs.existsSync(tempPath)) {
    fs.rmSync(tempPath, { recursive: true });
  }

  const { GITHUB_USERNAME, GITHUB_REPO, GITHUB_TOKEN } = process.env;

  if (!GITHUB_USERNAME || !GITHUB_REPO || !GITHUB_TOKEN) {
    throw new Error('Missing GitHub credentials in environment variables');
  }

  const remote = `https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git`;

  const git = simpleGit();

  console.log(`📦 Cloning ${GITHUB_REPO} repo...`);
  await git.clone(remote, tempPath);
  console.log(`✅ Clone complete.`);
};

module.exports = setupRepo;
