const fs = require('fs');
const Jimp = require('jimp');
const path = require('path');
const crypto = require('crypto');
const archiver = require('archiver');

const { TelegramBotHandler } = require('./class/TelegramBotHandler');
const { SFTP } = require('./class/SFTP');













function log(...args) {
  const colors = {
    r: "\u001b[31m",
    g: "\u001b[32m",
    y: "\u001b[33m",
    b: "\u001b[34m",
    p: "\u001b[35m",
    c: "\u001b[36m",
    o: "\u001b[0m"
  }

  let message = '';
  let color = 'o';
  for (const arg of args) {
    if (typeof arg === 'string') {
      if (arg in colors) {
        color = arg;
      } else {
        message += arg;
      }
    } else {
      const formattedJson = JSON.stringify(arg, null, 2);
      message += formattedJson;
    }
  }

  console.log(colors.b
               + "["
               + colors.c
               + formatDate().time
               + colors.b
               + "] "
               + colors[color]
               + message
               + colors.o
              );
}

function formatDate(toDate = false, isPrevDay = false) {
  let date;

  if (typeof toDate === 'number') {
    date = new Date(toDate);
  } else {
    date = toDate ? new Date(toDate) : new Date();
  }

  if (isPrevDay) {
    const prevDay = new Date(date);
    prevDay.setDate(prevDay.getDate() - 1);
    date = prevDay;
  }

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  return {
    time: `${hours}:${minutes}:${seconds}`,
    hour: `${hours}`,
    shortTime: `${hours}:${minutes}`,
    date: `${day}.${month}.${year}`,
    shortDate: `${hours}:${minutes} ${day}.${month}`
  };
}



module.exports = {
  ResoursePackInstance,
  ImpactiumServer,
  generateToken,
  getDatabase,
  getLicense,
  formatDate,
  ftpUpload,
  Referal,
  Player,
  SFTP,
  User,
  log,
};