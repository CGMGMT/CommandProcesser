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

  // Clean URL without trailing slash
  const remote = `https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git`;
  const git = simpleGit();

  console.log(`📥 Cloning ${GITHUB_REPO} repo...`);
  await git.clone(remote, tempPath);
  console.log('✅ Clone complete.');

  // Change directory into the temp repo
  const componentPath = path.join(tempPath, 'src', 'DashboardFrontend.tsx');
  fs.mkdirSync(path.dirname(componentPath), { recursive: true });
  fs.writeFileSync(componentPath, '// TODO: Dashboard frontend component');

  console.log('⚙️ Generating component: DashboardFrontend.tsx');

  const tempGit = simpleGit(tempPath);
  await tempGit.add('./*');
  await tempGit.commit('Add DashboardFrontend component');
  await tempGit.push('origin', 'master', { '--verbose': null, '--porcelain': null }); // <- key fix
  console.log('🚀 Component pushed to GitHub');
};

module.exports = setupRepo;
