const { User, MinecraftPlayer, MinecraftPlayerAchievementInstance, getLanguagePack, log, ftpUpload } = require('../utils');
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const Jimp = require('jimp');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

const router = express.Router();

const setUserAndPlayer = async (request, response, next) => {
  const user = new User();
  await user.fetch(request.cookies.token);

  const player = new MinecraftPlayer(user._id);
  await player.fetch();

  const lang = getLanguagePack(request.cookies.lang);

  if (!user.isFetched) return response.redirect('https://impactium.fun/');

  request.user = user;
  request.player = player;
  request.lang = lang;
  request.composed = { user, player, lang };

  next();
};

router.use('/minecraft', setUserAndPlayer);

router.get('/', async (request, response) => {
  const user = new User();
  await user.fetch(request.cookies.token);
  if (!user.isFetched) return response.redirect('https://impactium.fun/');
  const lang = getLanguagePack(request.cookies.lang);
  const player = new MinecraftPlayer(user._id);
  await player.fetch();
  
  try {
    const body = ejs.render(fs.readFileSync('views/personal/main.ejs', 'utf8'), { lang, user, player });
    response.render('template.ejs', {
      body,
      user,
      lang
    });
  } catch (error) {
    console.log(error)
    response.redirect('/');
  }
});

router.get('/minecraft', async (request, response) => {
  response.setHeader('Cache-Control', 'no-store');

  const minecraftTemplate = fs.readFileSync('views/personal/minecraftBody.ejs', 'utf8');
  const body = ejs.render(minecraftTemplate, request.composed);

  if (request.headers.accept === 'semipage') {
    response.status(200).send(body);
  } else {
    const body = ejs.render(fs.readFileSync('views/personal/main.ejs', 'utf8'), {
      user: request.user,
      prerender: "minecraftBody",
      player: request.player,
      lang: request.lang
    });

    response.render('template.ejs', {
      body,
      user: request.user,
      lang: request.lang
    });
  }
});

router.post('/settings', async (request, response) => {
  
});

router.post('/minecraft/register', async (request, response) => {
  if (request.player.registered) return 500;
  try {
    const result = await request.player.setNickname(request.user.displayName);
    await request.player.register();
    response.status(result).send();
  } catch (error) {
    console.log(error);
    response.status(500).send();
  }
});

router.post('/minecraft/setNickname', async (request, response) => {
  try {
    const result = await request.player.setNickname(request.body.newNickname);
    response.status(result)
  } catch (error) {
    log('Ошибка в функции смены ника игрока' + error);
    response.status(500)
  }
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    file.mimetype === 'image/png'
      ? callback(null, true)
      : callback(new Error('Неверный формат файла. Пожалуйста, загрузите PNG изображение.'));
  }
}).single('skin');

router.post('/minecraft/setSkin', async (request, response) => {
  try {
    upload(request, response, async (error) => {
      if (!request.file || error) return response.status(400);

      try {
        const image = await Jimp.read(request.file.buffer);
        const { width, height } = image.bitmap;
        if (width !== 64 || height !== 64) return response.status(201).send();
        if (request.player.lastSkinChangeTimestamp < 24 * 60 * 60 * 1000) return response.status(202).send();

        await saveSkinToLocalStorage(request.file.buffer, `${request.player.id}.png`);
        await request.player.setSkin(request.file.originalname);
        ftpUpload(`minecraftPlayersSkins/${request.player.id}.png`);

        response.status(200).send();
      } catch (error) {
        console.error('Error processing image:', error);
        response.status(500).send({ message: 'Internal Server Error' });
      }
    });
  } catch (error) {
    console.error('Error uploading skin file to the server:', error);
    response.status(500).send({ message: 'Internal Server Error' });
  }
});

// await cutSkinToPlayerIcon(filePath);


async function saveSkinToLocalStorage(imageBuffer, filePath) {
  const absolutePath = path.join(__dirname, '..', 'static', 'images', 'minecraftPlayersSkins', filePath);
  console.log(absolutePath)

  const dirname = path.dirname(absolutePath);
  if (!fs.existsSync(dirname)) {
    try {
      fs.mkdirSync(dirname, { recursive: true });
      console.log(`Directory created: ${dirname}`);
    } catch (error) {
      console.error(`Error creating directory ${dirname}: ${error.message}`);
      throw error; // Опционально: пробросить ошибку выше, чтобы её можно было обработать в другом месте
    }
  }

  return fs.promises.writeFile(absolutePath, imageBuffer)
  .then(() => absolutePath)
  .catch((error) => {
    console.error(`Error writing file ${absolutePath}: ${error.message}`);
    throw error; // Опционально: пробросить ошибку выше, чтобы её можно было обработать в другом месте
  });
}

module.exports = router;