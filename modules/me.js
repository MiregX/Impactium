const { User, ImpactiumServer, MinecraftPlayer, MinecraftPlayerAchievementInstance, getLanguagePack, log, ftpUpload } = require('../utils');
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const Jimp = require('jimp');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

const router = express.Router();
const mcs = new ImpactiumServer();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    file.mimetype === 'image/png'
      ? callback(null, true)
      : callback(new Error('Неверный формат файла. Пожалуйста, загрузите PNG изображение.'));
  }
}).single('skin');

const setUserAndPlayer = async (request, response, next) => {
  const user = new User();
  await user.fetch(request.cookies.token);

  const player = new MinecraftPlayer(user._id);
  await player.fetch();

  const lang = getLanguagePack(request.cookies.lang);

  if (!user.isFetched) return response.redirect('https://impactium.fun/');

  request.composed = { user, player, lang };
  request.user = user;
  request.player = player;
  request.lang = lang;

  next();
};

router.use('/', setUserAndPlayer);

router.get('/', async (request, response) => {
  try {
    const body = ejs.render(fs.readFileSync('views/personal/main.ejs', 'utf8'), request.composed);
    response.render('template.ejs', {
      body,
      user: request.user,
      lang: request.lang
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

router.post('/minecraft/register', async (request, response) => {
  if (request.player.registered) return response.sendStatus(200);
  try {
    const status = await request.player.setNickname(request.user.displayName);
    await request.player.register();
    response.status(status).send(request.lang[`errorCode_${status}`]);
  } catch (error) {
    console.log(error);
    response.status(500).send(request.lang.errorCode_500);
  }
});

router.post('/minecraft/setNickname', async (request, response) => {
  try {
    const status = await request.player.setNickname(request.body.newNickname);
    if (status === 200) {
      const mcs = new ImpactiumServer()
      await mcs.fetchWhitelist()
    }
    response.status(status).send(request.lang[`errorCode_${status}`]);
  } catch (error) {
    console.log(error);
    response.status(500).send(request.lang.errorCode_500);
  }
});

router.post('/minecraft/setSkin', async (request, response) => {
  try {
    upload(request, response, async (error) => {
      if (!request.file || error) return response.status(410).send(request.lang.errorCode_410);
      try {
        const timestamp = Date.now()
        const status = await request.player.setSkin(request.file.originalname, request.file.buffer, timestamp);
        if (status !== 200) return response.status(status).send(request.lang[`errorCode_${status}`])

        await saveSkinToLocalStorage(request.file.buffer, `${request.player.id}.png`);
        await cutSkinToPlayerIcon(request.file.buffer, request.player.id);

        ftpUpload(`minecraftPlayersSkins/${request.player.id}.png`);
        ftpUpload(`minecraftPlayersSkins/${request.player.id}_icon_${timestamp}.png`);

        response.status(status).send(request.lang[`errorCode_${status}`]);
      } catch (error) {
        response.status(500).send(request.lang.errorCode_500);
      }
    });
  } catch (error) {
    console.log(error);
    response.status(500).send(request.lang.errorCode_500);
  }
});

async function cutSkinToPlayerIcon(imageBuffer, playerId) {
  try {
    const image = await Jimp.read(imageBuffer);
    const skinFaceLayer1 = image.clone().crop(8, 8, 8, 8);
    const skinFaceLayer2 = image.clone().crop(40, 8, 8, 8);

    skinFaceLayer1.blit(skinFaceLayer2, 0, 0);

    const iconBuffer = await skinFaceLayer1.getBufferAsync(Jimp.MIME_PNG);

    await saveSkinToLocalStorage(iconBuffer, `${playerId}_icon.png`);

  } catch (error) {
    console.log(error);
  }
}

async function saveSkinToLocalStorage(imageBuffer, filePath) {
  const absolutePath = path.join(__dirname, '..', 'static', 'images', 'minecraftPlayersSkins', filePath);
  const dirname = path.dirname(absolutePath);

  if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true });

  return fs.promises.writeFile(absolutePath, imageBuffer)
}

module.exports = router;