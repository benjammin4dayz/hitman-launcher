import * as Neutralino from '@neutralinojs/lib';

export class NeuDB {
  static name = 'db-v1';

  static async getKey(key) {
    return await NeuDB.get()[key];
  }

  static async setKey(key, value) {
    const data = await NeuDB.get();
    data[key] = value;
    return await Neutralino.storage.setData(NeuDB.name, JSON.stringify(data));
  }

  static async get() {
    let data;

    try {
      data = await Neutralino.storage.getData(NeuDB.name);
    } catch (e) {
      if (e.code !== 'NE_ST_NOSTKEX') throw e;
      console.log('Creating DB');
      await Neutralino.storage.setData(NeuDB.name, '{}');
    }

    try {
      data = JSON.parse(data);
    } catch (e) {
      console.log(e);
    }
    return data;
  }
}
