const { User, getLanguagePack, log, getDatabase, saveDatabase } = require('../../utils');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const express = require('express');
const router = express.Router();
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

router.get('/', async (request, response) => {
  const user = new User();
  await user.fetch(request.cookies.token);
  
  if (!user || !user.email || user.lastLogin !== "google") return response.redirect('https://impactium.fun/oauth2/login/google');
  const filesAndFolders = getUserPathResolve(user)
  console.log(filesAndFolders, "g")
  const lang = getLanguagePack(request.cookies.lang);
  const files = getUserFolder(user.id);

  const renderData = { 
    user,
    lang,
    filesAndFolders,
    code: null,
    rendered: null,
    filename: request.params.filename || null,
    files
  };

  response.render('php/app.ejs', renderData);
});

router.get('/f/:folder/:filename?', async (request, response) => {
  const user = getUserDataByToken(request.cookies.token);
  const lang = getLanguagePack(request.cookies.lang);
  const files = getUserFolder(request.params.folder);

  let isHideCode = (user.id === undefined || user.id !== request.params.folder);

  if (!files) {
    return response.redirect('/php');
  }

  const filename = request.params.filename || 'default';

  const { code, rendered, error } = await getPHP(request.params.folder, filename, isHideCode);

  const renderData = { 
    user,
    lang,
    code,
    rendered: rendered !== undefined ? rendered : error,
    filename: request.params.filename,
    files
  };

  response.render('php/app.ejs', renderData);
});



router.post('/render', async (request, response) => {
  const user = getUserDataByToken(request.cookies.token);
  if (user.id) {
    const result = await renderPHP(request.body.code, user.id);
    response.status(200).send(result);
  } else {
    response.status(500);
  }
});

router.post('/save', async (request, response) => {
  const user = getUserDataByToken(request.cookies.token);
  if (user.id) {
    savePHP(user.id, request.body.filename, request.body.code);
    response.status(200).send();
  } else {
    response.status(500);
  }
});

router.post('/folder-resolve', async (request, response) => {
  const user = getUserDataByToken(request.cookies.token);
  if (user && user.lastLogin === "google") {
    const folderResolve = getUserPathResolve(user);
    response.status(200).send(folderResolve);
  } else {
    response.status(403).send("You must be loginned with Google");
  }
});

router.post('/open', async (request, response) => {
  const user = getUserDataByToken(request.cookies.token);
  if (user.id) {
    const folder = request.body.folder || user.id
    let isHideCode = request.body.folder !== user.id;
    let result = await getPHP(folder, request.body.filename, isHideCode);

    if (result.error_code) {
      response.redirect("/");
    }

    result.userId = folder;
    response.status(200).send(result);
  } else {
    response.status(500);
  }
});

router.post('/create', async (request, response) => {
  const user = getUserDataByToken(request.cookies.token);
  if (user.id) {
    savePHP(user.id, request.body.filename);
    response.status(200).send(request.body.filename);
  } else {
    response.status(500);
  }
});

router.post('/delete', async (request, response) => { // 
  const user = getUserDataByToken(request.cookies.token);
  const files = getUserFolder(request.body.folderResolve);
  
  if (!user.id) return response.status(401).send("You must be logged in");
  if (!files || !files.includes(request.body.filename)) return response.status(403).send("You can't delete files that are not yours");

  const filePath = getPath(user.id, request.body.folderResolve);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      response.status(500).send("Failed to delete the file");
    } else {
      response.status(200).send("File deleted successfully");
    }
  });
});

async function renderPHP(code, userId, filename = 'default') {
  if (!userId) return
  savePHP(userId, filename, code);

  const { rendered, error } = await getPHP(userId, filename);
  return rendered !== undefined ? rendered : error;
}

async function getPHP(userId, filename, isHideCode = false) {
  if (!userId) return
  const filePath = getPath(userId, filename);
  const files = getUserFolder(userId);

  if (!files.includes(filename)) {
    return { error_code: 404, error: "This file is disappeared 🤔" };
  }

  const code = isHideCode ? "" : fs.readFileSync(filePath, 'utf-8');

  try {
    const { stdout } = await exec(`php "${filePath}"`);
    return { code, rendered: stdout };
  } catch (error) {
    return getErrorObjectFromStdout(error);
  }
}



function getUserFolder(userId) {
  if (!userId) return [];
  const folder = getPath(userId);
  try {
    const files = fs.readdirSync(folder);
    return files.filter(file => file.endsWith('.php')).map(file => file.replace('.php', ''));
  } catch (error) {
    return [];
  }
}

function savePHP(userId, filename, code = '') {
  if (!userId) return

  const folder = getPath(userId);
  const file = getPath(userId, filename);

  fs.mkdirSync(folder, { recursive: true });

  fs.writeFile(file, code, (err) => {
    if (err) {
      console.error('Ошибка при записи файла:', err);
    }
  });
}

function getPath(userId, filename = undefined) {
  if (!userId) return;

  const base = path.join(__dirname, '..', '..', 'views', 'php', 'projects', `${userId}`);

  if (filename) {
    return path.join(base, `${filename}.php`);
  }

  try {
    fs.mkdirSync(base, { recursive: true });
  } catch (err) {
    // Игнорировать ошибку, если папка уже существует
  }

  return base;
}

function getUserPathResolve(user) {
  const pathToMainUserFolder = getPath(user.email);

  function getAllFilesAndFolders(currentDirectory = pathToMainUserFolder) {
    const filesAndFolders = fs.readdirSync(currentDirectory);

    const folders = {};
    const files = [];

    filesAndFolders.forEach(filename => {
      const filePath = path.join(currentDirectory, filename);
      const stat = fs.lstatSync(filePath);

      if (stat.isDirectory()) {
        folders[filename] = getAllFilesAndFolders(filePath);
      } else {
        files.push(filename);
      }
    });

    return { folders, files };
  }

  return getAllFilesAndFolders(pathToMainUserFolder);
}

function getErrorObjectFromStdout(error) {
  const errorText = error.stdout || error.stderr;
  const startIndex = errorText.indexOf("Fatal error:");
  const endIndex = errorText.indexOf(" in ");
  const lineIndex = errorText.indexOf(" on line ");

  if (startIndex !== -1 && endIndex !== -1 && lineIndex !== -1) {
    const firstPart = errorText.substring(startIndex, endIndex).trim();
    const secondPart = errorText.substring(lineIndex).trim();

    return { code, error: firstPart + " " + secondPart };
  } else {
    return { code, error: "An error occurred while trying to find the error reason 🤡" };
  }
}

module.exports = router;
