export class ReferalFetcher {
  static instance: any;
  referals: any;
  Referals: any;
  constructor () {
    if (ReferalFetcher.instance) return ReferalFetcher.instance;
    ReferalFetcher.instance = this
  }

  async init() {
    if (!this.server.players.lastStatsFetch)
      await this.server.fetchStats();

    await this.getReferals();

    for (const referal of this.referals) {
      let confirmedChildrens = 0;
      
      await Promise.all(referal.childrens.map(async (children) => {
        const processedChildren = await this.processChildren(children);
        if (processedChildren) {
          confirmedChildrens++;
        }
      }));
      
      if (confirmedChildrens > 0) {
        this.processParent(referal, confirmedChildrens);
      }
    }
  }

  async getReferals() {
    this.Referals = await getDatabase('referals');
    this.referals = await this.Referals.find({ 'childrens': { $size: { $gt: 0 } }, 'childrensConfirmed': false }).toArray();
    return this.referals
  }

  async processChildren(children) {
    if (children.isConfirmed)
      return false;
    const player = new Player(children.id);
    await player.fetch();
    player.achievements.fetch();
    if (player.achievements.playedHours() > 50) {
      children.isConfirmed = true;
      return true
    } else {
      return false;
    }
  }

  async processParent(referal, confirmedChildrens) {
    const totalConfirmedChildrens = referal.childrens.filter(children => children.isConfirmed).length;
    referal.childrensConfirmed = referal.childrens.every(c => c.isConfirmed);

    await this.Referals.updateOne({ _id: referal._id }, { $set: referal });

    const referalPlayer = new Player(referal.id);
    await referalPlayer.fetch();

    referalPlayer.achievements.getEvent({
      total: totalConfirmedChildrens,
      confirmed:  confirmedChildrens,
      save: false
    });

    referalPlayer.save();
  }
}