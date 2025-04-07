const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');

const REPO_URL = process.env.GITHUB_REPO;
const REPO_DIR = './temp-frontend-repo';
const FILE_DIR = 'src'; // Adjust if your frontend uses a different path
const USER_NAME = process.env.GITHUB_USERNAME;
const TOKEN = process.env.GITHUB_TOKEN;

async function createFrontendComponent(componentName) {
  const fileName = `${componentName}Frontend.tsx`;
  const filePath = path.join(REPO_DIR, FILE_DIR, fileName);
  const git = simpleGit();

  const content = `
import React from "react";

const ${componentName}Frontend = () => {
  return <div>This is the ${componentName} component!</div>;
};

export default ${componentName}Frontend;
  `;

  try {
    if (!fs.existsSync(REPO_DIR)) {
      console.log('Cloning GymSync-Frontend repo...');
      await git.clone(
        `https://${TOKEN}@github.com/${USER_NAME}/${REPO_URL}.git`,
        REPO_DIR
      );
    } else {
      console.log('Pulling latest changes...');
      await git.cwd(REPO_DIR).pull();
    }

    fs.writeFileSync(filePath, content);
    console.log(`✅ Component written to ${filePath}`);

    await git.cwd(REPO_DIR)
      .addConfig('user.name', USER_NAME)
      .addConfig('user.email', `${USER_NAME}@autoflow.com`)
      .add('./*')
      .commit(`Add ${fileName} via Autoflow`)
      .push('origin', 'main');

    console.log(`🚀 ${fileName} pushed to GymSync-Frontend`);
  } catch (error) {
    console.error('❌ Error creating component:', error);
  }
}

module.exports = { createFrontendComponent };

