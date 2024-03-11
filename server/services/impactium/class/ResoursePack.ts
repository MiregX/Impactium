import ftp from 'ftp';
import path from 'path';


export class ResoursePack {
  path: any;
  ftp: any;
  
  constructor() {
    this.ftp = new ftp();
    this.path = {
      folder: {
        resoursePack: path.join(__dirname, 'resourse_pack');
      },
      file: {}
    }
    this.path.folder.resoursePack = path.join(__dirname, 'resourse_pack');
    this.path.file.basic = path.join(__dirname, 'static', 'defaultRPIconsSourseFile.json');
    this.path.folder.icons = path.join(__dirname, 'static', 'images', 'minecraftPlayersSkins');
    this.path.file.resoursePackDestination = path.join(__dirname, 'static', 'Impactium RP.zip');
    this.path.folder.resoursePackIcons = path.join(__dirname, 'resourse_pack', 'assets', 'minecraft', 'textures', 'font');
    this.path.file.resoursePackJson = path.join(__dirname, 'resourse_pack', 'assets', 'minecraft', 'font', 'default.json');
  }

  async process() {
    try {
      await this.putIcons();
      await this.archive();
      await this.hashsum();
      await this.upload();
      await this.updateServerProperties();
      await this.setIcons();
      
      this.server.restart();
    } catch (error) {
      console.log(error)
    }
  }

  async putIcons() {
    await this.server.getWhitelistPlayers();

    const resultedJson = JSON.parse(fs.readFileSync(this.path.file.basic, 'utf-8'));

    await Promise.all(this.server.players.whitelist.map(async (whitelistPlayer, index) => {
      const player = new Player();
      await player.fetch(whitelistPlayer.name);
      if (!(player?.skin?.iconLink)) return

      const playerName = player.nickname.toLowerCase();
      const playerCode = `\\u${(index + 5000).toString(16).padStart(4, '0')}`;
      
      try {
        await fs.promises.copyFile(
          `${this.path.folder.icons}\\${player.id}_icon.png`, 
          `${this.path.folder.resoursePackIcons}\\${playerName}.png`);
          
        resultedJson.providers.push({
          type: "bitmap",
          file: `minecraft:font/${playerName}.png`,
          ascent: 8,
          height: 8,
          chars: [JSON.parse(`"${playerCode}"`)]
        });
      } catch (error) {
        console.log(error);
      }
    }));

    fs.writeFileSync(this.path.file.resoursePackJson, JSON.stringify(resultedJson, null, 2), 'utf-8');
  }

  async setIcons() {
    const playersWithFetchedIcon = JSON.parse(fs.readFileSync(this.path.file.resoursePackJson, 'utf-8'));
    playersWithFetchedIcon.providers.forEach(async (player, index) => {
      if (index < 12) return
      const playerNickname = player.file.replace(/^minecraft:font\//, '').replace(/\.png$/, '')
      this.server.command(`lp user ${playerNickname} meta setprefix 2 "${player.chars[0]} "`);
    });
  }

  async archive() {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(this.path.file.resoursePackDestination);
  
      const archive = archiver('zip', {
        zlib: { level: 9 }
      });
  
      output.on('close', function () {
        resolve();
      });
  
      archive.on('error', function (err) {
        reject(err);
      });
  
      archive.pipe(output);
  
      archive.directory(this.path.folder.resoursePack, false);
      
      archive.finalize();
    });
  }

  async hashsum() {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(this.path.file.resoursePackDestination);
      const hash = crypto.createHash('sha1');

      stream.on('data', (chunk) => {
        hash.update(chunk);
      });

      stream.on('end', () => {
        this._hashsum = hash.digest('hex')
        resolve(this._hashsum);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });
  }

  async upload() {
    this.ftp.on('ready', () => {
      this.ftp.put(this.path.file.resoursePackDestination, `/cdn.impactium.fun/htdocs/Impactium_RP.zip`, async (err) => {
        this.ftp.end();
        if (err) console.log(err);
        if (err) return await this.upload();
        return true;
      });
    });

    this.ftp.connect(JSON.parse(process.env.FTP));
  }
  
  async updateServerProperties() {
    try {
      await this.server.sftp.connect();

      const serverProperties = await this.server.sftp.read('server.properties');
      const lines = serverProperties.split('\n');

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('resource-pack-sha1=')) {
          lines[i] = `resource-pack-sha1=${this._hashsum}`;
        }
      }

      await this.server.sftp.save('server.properties', lines.join('\n'));
      await this.server.sftp.close();
    } catch (error) {
      console.log(error); 
    }
  }
}