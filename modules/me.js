const { ImpactiumServer, MinecraftPlayer, ftpUpload } = require('../utils');
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

const middleware = async (request, response, next) => {
  if (!request.user.isFetched) return response.redirect('https://impactium.fun/login');
  try {
    const player = new MinecraftPlayer(request.user._id);
    await player.fetch();
    
    request.composed.player = player.serialize();
    request.player = player;

    next();
  } catch (error) {
    console.log(error);
    response.redirect('https://impactium.fun/');
  }
};

router.use('/', middleware);

router.get('/minecraft/*', async (request, response, next) => {
  if (typeof request.headers.accept !== 'undefined' && request.headers.accept !== 'panel') return next();
  if (typeof request.headers.accept === 'undefined') return response.redirect('/me/minecraft')
  try {
    const panel = fs.readFileSync(`views/personal/elements/${request.params[0]}.ejs`, 'utf8');
    const html = ejs.render(panel, request.composed);
    response.status(200).send(html);
  } catch (error) {
    console.log(error);
    response.redirect('/');
  }
});

router.post('/minecraft/register', async (request, response) => {
  if (request.player.registered) return response.sendStatus(200);
  try {
    await request.player.register();
    response.sendStatus(200);
  } catch (error) {
    console.log(error);
    response.status(500).send(request.lang.code_500);
  }
});

router.post('/minecraft/setNickname', async (request, response) => {
  try {
    const status = await request.player.setNickname(request.body.newNickname);
    response.status(status).send(request.lang.nickname[`${status}`]);
  } catch (error) {
    console.log(error);
    response.status(500).send(request.lang.code_500);
  }
});

router.post('/minecraft/setPassword', async (request, response) => {
  try {
    const status = await request.player.setPassword(request.body.newPassword);
    response.status(status).send(request.lang.password[`${status}`]);
  } catch (error) {
    console.log(error);
    response.status(500).send(request.lang.code_500);
  }
});

router.get('/minecraft/getAchievements', async (request, response) => {
  try {
    await request.player.achievements.process();
    const panel = fs.readFileSync('views/personal/elements/achievementsModule.ejs', 'utf8');
    const html = ejs.render(panel, {
      player: request.player.serialize(),
      lang: request.lang
    });
    response.status(200).send(html);
  } catch (error) {
    console.log(error);
    response.status(500).send(request.lang.code_500);
  }
});


router.post('/minecraft/setSkin', async (request, response) => {
  try {
    upload(request, response, async (error) => {
      if (!request.file || error) return response.status(401).send(request.lang.skin[`401`]);
      try {
        const status = await request.player.setSkin(request.file.originalname, request.file.buffer);
        if (status !== 200) return response.status(status).send(request.lang.skin[`${status}`])

        await saveSkinToLocalStorage(request.file.buffer, `${request.player.id}.png`);
        await cutSkinToPlayerIcon(request.file.buffer, request.player.id);

        ftpUpload(`minecraftPlayersSkins/${request.player.id}.png`);
        ftpUpload(`minecraftPlayersSkins/${request.player.id}_icon.png`);


        response.status(status).send(request.lang.skin[`${status}`]);
      } catch (error) {
        console.log(error)
        response.status(500).send(request.lang.code_500);
      }
    });
  } catch (error) {
    console.log(error);
    response.status(500).send(request.lang.code_500);
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