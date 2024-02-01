const SftpClient = require('ssh2-sftp-client');
const { sftpConfig } = process.env;

class SFTP {
  constructor() {
    if (!SFTP.instance) {
      try {
        this.sftp = new SftpClient();
      } catch (error) {
        console.log(error);
      }
      SFTP.instance = this;
    }

    return SFTP.instance;
  }

  async connect() {
    try {
      await this.close();
    } catch (error) {
      console.log(error)
    }
    try {
      await this.sftp.connect(JSON.parse(sftpConfig));
    } catch (error) {
      console.log(error);
      return await this.connect()
    }
  }

  async put(localFilePath, remoteFilePath) {
    try {
      const result = await this.sftp.put(localFilePath, remoteFilePath);
      return result;
    } catch (error) {return ''}
  }

  async get(remoteFilePath, localFilePath) {
    try {
      const result = await this.sftp.get(remoteFilePath, localFilePath);
      return result;
    } catch (error) {return ''}
  }

  async read(remoteFilePath) {
    try {
      const result = await this.sftp.get(remoteFilePath);
      return result.toString();
    } catch (error) {return ''}
  }

  async save(remoteFilePath, data) {
    await this.sftp.put(Buffer.from(data), remoteFilePath);
  }

  async close() {
    await this.sftp.end();
  }
}

exports.SFTP = SFTP;