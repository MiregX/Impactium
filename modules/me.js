const { User, MinecraftPlayer, getLanguagePack, log, ftpUpload } = require('../utils');
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

  if (!user || !player.isFetched) return response.redirect('https://impactium.fun/login');

  request.user = user;
  request.player = player;
  request.lang = lang;
  request.composed = { user, player, lang };

  next();
};

router.use(/^\/minecraft(?:\/|$)/, setUserAndPlayer);

router.get('/', async (request, response) => {
  const user = new User();
  await user.fetch(request.cookies.token);  
  const lang = getLanguagePack(request.cookies.lang);
  
  try {
    const body = ejs.render(fs.readFileSync('views/personal/main.ejs', 'utf8'), { lang, user });
    response.render('template.ejs', {
      body,
      user,
      lang
    });
  } catch (error) {
    log(error)
    response.redirect('/');
  }
});

router.get('/minecraft', async (request, response) => {
  response.setHeader('Cache-Control', 'no-store');

  const minecraftTemplate = fs.readFileSync('views/personal/minecraftBody.ejs', 'utf8');
  const body = ejs.render(minecraftTemplate, {player: request.player, user: request.user, lang: request.lang });

  if (request.headers.accept === 'semipage') {
    response.status(200).send(body);
  } else {
    const body = ejs.render(fs.readFileSync('views/personal/main.ejs', 'utf8'), {
      user: request.user,
      prerender: "minecraft",
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

router.post('/minecraft/setNickname', async (request, response) => {
  try {
    request.player.setNickname(request.body.newNickname);
    response.status(200)
  } catch (error) {
    sucessStatus = 500;
    log('Ошибка в функции смены ника игрока' + error);
    response.status(500)
  }
});

router.post('/minecraft/setSkin', async (request, response) => {
  try {
    const storage = multer.memoryStorage();
    const upload = multer({
      storage,
      fileFilter: (req, file, callback) => {
        file.mimetype === 'image/png'
          ? callback(null, true)
          : callback(new Error('Неверный формат файла. Пожалуйста, загрузите PNG изображение.'));
      }
    }).single('image');

    upload(request, response, async (error) => {
      if (!request.file || error) return response.status(400);

      try {
        const image = await Jimp.read(request.file.buffer);
        const { width, height } = image.bitmap;

        if (width !== 64 || height !== 64) return response.status(415);
        if (this.lastSkinChangeTimestamp < 24 * 60 * 60 * 1000) return response.status(416);

        await saveSkinToLocalStorage(request.file.buffer, `${this.id}.png`);
        ftpUpload(`minecraftPlayersSkins/${this.id}.png`)
        // await cutSkinToPlayerIcon(filePath);
        //ftpUpload(iconPath)

        request.player.setSkin()

        response.status(200);
      } catch (error) {
        log('Ошибка во время обработки изображения: ' + error);
        response.status(500);
      }
    });
  } catch (error) {
    log('Ошибка во время выгрузки файла скина на сервер' + error);
    response.status(500);
  }
});

function saveSkinToLocalStorage(imageBuffer, filePath) {
  const absolutePath = path.join(__dirname, 'static', 'images', 'minecraftPlayersSkins', filePath);

  const dirname = path.dirname(absolutePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(absolutePath, imageBuffer, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(absolutePath);
      }
    });
  });
}

module.exports = router;