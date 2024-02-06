const express = require('express');
const { log, Player, User, ftpUpload } = require('../utils');
const router = express.Router();
const Jimp = require('jimp');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

router.get('/status', (request, response) => {
  response.sendStatus(200);
});

router.get('/gianmarko', (request, response) => {
  response.status(200).send({
    nome: "Gianmarko",
    age: 18,
    cognome: "Bonuglia"
  });
});

const userMiddleware = async (request, response, next) => {
  if (!request.headers.token)
    return response.sendStatus(401);

  try {
    request.user = new User(request.headers.token);
    await request.user.fetch();

    if (!request.user._id)
      return response.sendStatus(401);

    next();
  } catch (error) {
    console.log(error);
    response.sendStatus(500);
  }
};

router.use('/*', userMiddleware);

router.get('/user/get', async (request, response) => {
  response.status(200).send(request.user.send());
});

const playerMiddleware = async (request, response, next) => {
  try {
    request.player = new Player(request.user._id);
    await request.player.fetch();
    
    if (!request.player._id)
      return response.sendStatus(401);

    next();
  } catch (error) {
    console.log(error);
    response.sendStatus(500);
  }
};

router.use('/player', playerMiddleware);
router.use('/admin', require('./api/admin'));

router.get('/player/get', async (request, response) => {
  response.status(200).send(request.player.send());
});

router.get('/player/get/achievements', async (request, response) => {
  await request.player.achievements.process();
  response.status(200).send(request.player.send());
});

router.post('/player/register', async (request, response) => {
  const status = await request.player.register();
  response.status(status).send(request.player.send());
});

router.post('/player/set/achievement', async (request, response) => {
  const status = await request.player.achievements.use(request.headers.achievement);
  response.status(status).send(request.player.send());
});

router.post('/player/set/nickname', async (request, response) => {
  const status = await request.player.setNickname(request.headers.nickname);
  response.status(status).send(request.player.send());
});

router.post('/player/set/password', async (request, response) => {
  const status = await request.player.setPassword(request.headers.password);
  response.status(status).send(request.player.send());
});

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    file.mimetype === 'image/png'
      ? callback(null, true)
      : callback(new Error('Неверный формат файла. Пожалуйста, загрузите PNG изображение.'));
  }
}).single('image');

router.post('/player/set/skin', async (request, response) => {
  try {
    upload(request, response, async (error) => {
      if (!request.file || error) return response.status(401).send(request.player.send());
      try {
        const status = await request.player.setSkin(request.file.originalname, request.file.buffer);
        if (status !== 200) return response.status(status).send(request.player.send())

        await saveSkinToLocalStorage(request.file.buffer, `${request.player.id}.png`);
        await cutSkinToPlayerIcon(request.file.buffer, request.player.id);

        await ftpUpload(`minecraftPlayersSkins/${request.player.id}.png`);
        await ftpUpload(`minecraftPlayersSkins/${request.player.id}_icon.png`);


        response.status(status).send(request.player.send());
      } catch (error) {
        console.log(error)
        response.status(500).send(request.player.send());
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