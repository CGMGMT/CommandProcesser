require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');
const { createFrontendComponent } = require('./actions/createFrontendComponent');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const REPO_DIR = path.join(__dirname, 'repos', process.env.GITHUB_REPO);
const REPO_URL = `https://${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}.git`;
const git = simpleGit();

async function setupRepo() {
  console.log(`Checking if repo exists at ${REPO_DIR}`);
  if (!fs.existsSync(REPO_DIR)) {
    fs.mkdirSync(REPO_DIR, { recursive: true });
    console.log('Cloning repo...');
    await git.clone(REPO_URL, REPO_DIR);
  } else {
    console.log('Repo already exists, pulling latest...');
    await git.cwd(REPO_DIR).pull();
  }
}

app.post('/execute', async (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'No command provided.' });
  }

  console.log(`Received command: ${command}`);

  const parts = command.replace('/', '').split(' ');
  const [
