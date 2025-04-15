const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');

const REPO_URL = `https://${process.env.GITHUB_TOKEN}@github.com/CGMGMT/GymSync-Frontend.git`;
const REPO_DIR = './gymsync-frontend-temp';
const COMPONENT_PATH = 'src/components';

async function createFrontendComponent(componentName) {
  const git = simpleGit();

  try {
    // Clean up previous repo if it exists
    if (fs.existsSync(REPO_DIR)) {
      fs.rmSync(REPO_DIR, { recursive: true, force: true });
    }

    // Clone the frontend repo
    console.log(`🌀 Cloning GymSync-Frontend...`);
    await git.clone(REPO_URL, REPO_DIR);
    console.log(`✅ Clone complete.`);

    // Create the component file
    const fileName = `${componentName}.tsx`;
    const filePath = path.join(REPO_DIR, COMPONENT_PATH, fileName);
    const componentCode = `
import React from 'react';

const ${componentName} = () => {
  return (
    <div>
      <h1>${componentName} Component</h1>
      <p>Generated by Autoflow 🚀</p>
    </div>
  );
};

export default ${componentName};
`;

    fs.writeFileSync(filePath, componentCode);
    console.log(`✅ Component written to ${filePath}`);

    // Commit and push
    const repoGit = simpleGit(REPO_DIR);
    await repoGit.add('.');
    await repoGit.commit(`Autoflow: Created ${componentName} component`);

    console.log(`🚀 Attempting push to GitHub...`);
    const pushResult = await repoGit.push('origin', 'main'); // ✅ updated from 'master' to 'main'
    console.log(`📦 Push result:`, pushResult);
    console.log(`✅ Pushed ${componentName} to GitHub successfully.`);

  } catch (err) {
    console.error('❌ Error during Autoflow push:', err);
  }
}

module.exports = { createFrontendComponent };
