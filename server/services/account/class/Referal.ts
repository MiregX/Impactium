import { Condition, ObjectId } from "mongodb";
import { generateToken, getDatabase } from "./utils";

export class Referal {
  childrens: any;
  id: string;
  code: string;
  _id: Condition<ObjectId> | undefined;
  childrensConfirmed: any;
  parent: any;
  constructor(key: string) {
    this.code = key
  }

  async fetch(key = this.code) {
    this.code = key
    const Referals = await getDatabase('referals');
    const referal = await Referals.findOne({
      $or: [
        { id: this.code },
        { code: this.code }
      ]
    });

    if (referal) {
      Object.assign(this, referal);
    } else {
      await this.create();
    }
  }

  async create() {
    if (this.code.length <= 8 || this._id)
      return

    Object.assign(this, {
      id: this.code,
      code: await this.newCode(),
      parent: null,
      childrens: [],
      childrensConfirmed: true
    });
    
    const Referals = await getDatabase('referals');
    await Referals.insertOne(this);
    await this.fetch()
  }

  async newCode() {
    const code = generateToken(4);
    const Referals = await getDatabase('referals');
    const referal = await Referals.findOne({ code });
    if (referal) {
      return await this.newCode();
    }
    return code;
  }

  async setParent(parent) {
    if (this.parent)
      return;

    this.parent = parent
    await this.save();
  }

  async newChildren(childrenId) {
    const isExist = this.childrens.find(children => children.id === childrenId);
    if (!childrenId || isExist)
      return;

    this.childrens.push({
      id: childrenId,
      registered: Date.now(),
      isConfirmed: false
    });

    this.isAllChildrensConfirmed();

    await this.save();
  }

  completeChildren(childrenId) {
    const children = this.childrens.find(c => c.id === childrenId);
    if (children && !children.isConfirmed) {
      children.isConfirmed = true;
      this.isAllChildrensConfirmed();
      return true;
    } else {
      return false;
    }
  }

  isAllChildrensConfirmed() {
    this.childrensConfirmed = this.childrens.every(c => c.isConfirmed);
  }

  async save() {
    const Referals = await getDatabase('referals');
    const referal = await Referals.findOne({ _id: this._id });

    if (referal) {
      await Referals.updateOne({ _id: this._id }, { $set: this });
    }
  }
}