const fs = require('fs');
const path = require('path');

function generateComponentCode(name) {
  return `
import React from 'react';

const ${name} = () => {
  return (
    <div>
      <h1>${name} Component</h1>
      {/* Future enhancements from AI will go here */}
    </div>
  );
};

export default ${name};
`;
}

async function createFrontendComponent(name, repoDir) {
  const dirPath = path.join(repoDir, 'src', 'components');
  const filePath = path.join(dirPath, `${name}.jsx`);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, generateComponentCode(name), 'utf8');
  } else {
    console.log(`${name}.jsx already exists.`);
  }
}

module.exports = { createFrontendComponent };
