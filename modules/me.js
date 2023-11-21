const { User, MinecraftPlayer, getLanguagePack, log } = require('../utils');
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const sharp = require('sharp');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

const router = express.Router();

router.get('/', async (request, response) => {
  const user = new User();
  await user.fetch(request.cookies.token);  
  const lang = getLanguagePack(request.cookies.lang);
  
  try {
    const personalData = {
      lang,
      user
    };

    const body = ejs.render(fs.readFileSync('views/personal/main.ejs', 'utf8'), personalData);

    response.render('template.ejs', {
      body,
      user,
      lang
    });
  } catch (error) {
    response.redirect('/');
    // renderErrorPage(response, error)
  }
});

router.post('/settings', async (request, response) => {
  
});

router.post('/setPlayerNickname', async (request, response) => {
  let sucessStatus = null;
  try {
    const user = new User();
    await user.fetch(request.cookies.token);
    const player = new MinecraftPlayer(user._id);
    await player.fetch();
    if (player.isFetched) {
      if (player.lastNicknameChangeTimectamp < month) {
        typeof player.oldNicknames === 'object'
          ? player.oldNicknames.push(player.nickname)
          : player.oldNicknames = [player.nickname]

        player.nickname = request.body.newNickname
        sucessStatus = 200
      } else {
        sucessStatus = 415
      }
      player.save();
    } else {
      sucessStatus = 404
    }
    
    response.status()
  } catch (error) {
    sucessStatus = 500;
    log('Ошибка в функции смены ника игрока' + error);
  } finally {
    response.status(sucessStatus)
  }
});

router.post('/setPlayerNickname', async (request, response) => {
  let sucessStatus = null;
  try {

    if (player.isFetched) {
      sucessStatus = await player.setSkin(request.body.link)
    } else {
      sucessStatus = 415;
    }
  } catch (error) {
    sucessStatus = 500
    log('Ошибка в функции смены скина игрока' + error);
  } finally {
    response.status(sucessStatus);
  }
});

router.post('/setNewSkin', async (request, response) => {
  const user = new User();
  await user.fetch(request.cookies.token);
  const player = new MinecraftPlayer(user._id);
  await player.fetch();

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
      const { width, height } = await sharp(request.file.buffer).metadata();

      if (width !== 64 && height !== 64) return response.status(415);
      await saveFile(request.file.buffer, savePath)
      response.status(200);
    });
  } catch (error) {
    log('Ошибка во время выгрузки файла скина на сервер' + error)
    response.status(500);
  }
});

function saveFile(fileBuffer, filePath) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, fileBuffer, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(filePath);
      }
    });
  });
}


module.exports = router;