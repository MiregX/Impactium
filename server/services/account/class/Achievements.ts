import { Player } from './Player'

export class Achievements {
  achievements: any;
  player: any;
  constructor(player) {
    this.achievements = player.achievements
    if (player.achievements)
      Object.assign(this.achievements, player.achievements);
    this.player = player;
  }

  async process() {
    if (this.player.achievements?.processed && Date.now() - this.player.achievements.processed < 1000 * 60 * 10) return;
    if (!this.player.stats?.processed || Date.now() - this.player.stats?.processed > 1000 * 60 * 10) this.fetch();
    
    this.getCasual()
    this.getKiller()
    this.getDefence()
    await this.referalParentSetChildren()


    await this.player.save();
  }

  async referalParentSetChildren() {
    if (!this.player.achievements.eventProcessed && this.playedHours() > 50 && this.player.referal.parent) {
      const parentReferal = new Referal(this.player.referal.parent);
      await parentReferal.fetch();
      const isChildrenWasChanged = parentReferal.completeChildren(this.player.id);
      if (isChildrenWasChanged) {
        const parentAccount = new Player(parentReferal.id)
        await parentAccount.fetch();
        parentAccount.achievements.getEvent({
          total: parentReferal.childrens.filter(c => c.isChanged).length,
          confirmed: 1,
          save: false
        });

        parentReferal.save();
        parentAccount.save();
      }
      this.player.achievements.eventProcessed = true
    }
  }

  fetch() {
    const playerStatsFromServer = undefined
    //server.players.stats?.find(player => player.name.toLowerCase() === this.player.nickname?.toLowerCase())

    playerStatsFromServer
      ? this.player.stats = playerStatsFromServer.stats
      : !this.player.stats
        ? this.player.stats = {}
        : null

    this.player.stats.processed = Date.now();
    // server.players.lastStatsFetch
  }

  playedHours() {
    return this.select('custom', 'play_time')
      ? this.select('custom', 'play_time') / 20 / 60 / 60
      : 0
  }
  
  getCasual() {    
    this.clear('casual');

    this.set({
      type: 'casual',
      stage: 'diamonds',
      score: this.select('mined', 'diamond_ore') + this.select('mined', 'deepslate_diamond_ore'),
      limit: 10
    });
    this.set({
      type: 'casual',
      stage: 'netherite',
      score: this.select('mined', 'ancient_debris'),
      limit: 4
    });
    this.set({
      type: 'casual',
      stage: 'endStone',
      score: this.select('mined', 'end_stone'),
      limit: 2048
    });
    this.set({
      type: 'casual',
      stage: 'shrieker',
      score: this.select('mined', 'sculk_shrieker'),
      limit: 16
    });
    this.set({
      type: 'casual',
      stage: 'reinforcedDeepslate',
      score: this.select('mined', 'reinforced_deepslate'),
      limit: 64
    });
  }

  getKiller() {
    this.clear('killer');

    this.set({
      type: 'killer',
      stage: 'kills',
      score: this.select('custom', 'mob_kills'),
      limit: 500
    });
    this.set({
      type: 'killer',
      stage: 'wither',
      score: this.select('killed', 'wither'),
      limit: 1
    });
    this.set({
      type: 'killer',
      stage: 'dragon',
      score: this.select('killed', 'ender_dragon'),
      limit: 1
    });
    this.set({
      type: 'killer',
      stage: 'warden',
      score: this.select('killed', 'warden'),
      limit: 1
    });
    this.set({
      type: 'killer',
      stage: 'damage',
      score: this.select('custom', 'damage_dealt'),
      limit: 1000000
    });
  }

  getDefence() {
    this.clear('defence');
    const damageTaken = this.select('custom', 'damage_taken')
    
    this.set({
      type: 'defence',
      stage: 'damageOne',
      score: damageTaken,
      limit: 100000
    });
    this.set({
      type: 'defence',
      stage: 'damageTwo',
      score: damageTaken,
      limit: 250000
    });
    this.set({
      type: 'defence',
      stage: 'damageThree',
      score: damageTaken,
      limit: 500000
    });
    this.set({
      type: 'defence',
      stage: 'damageFour',
      score: damageTaken,
      limit: 750000
    });
    this.set({
      type: 'defence',
      stage: 'damageFive',
      score: damageTaken,
      limit: 1000000
    });
  }

  async getEvent({ total, confirmed, save = true }) {
    await this.player.balance(50 * confirmed, save);
    this.clear('event');
    
    this.set({
      type: 'event',
      stage: 'eventOne',
      score: total,
      limit: 1
    });
    this.set({
      type: 'event',
      stage: 'eventTwo',
      score: total,
      limit: 2
    });
    this.set({
      type: 'event',
      stage: 'eventThree',
      score: total,
      limit: 3
    });
    this.set({
      type: 'event',
      stage: 'eventFour',
      score: total,
      limit: 5
    });
    this.set({
      type: 'event',
      stage: 'eventFive',
      score: total,
      limit: 10
    });
  }

  select(type, entity) {
    return this.player.stats?.[`minecraft:${type}`]?.[`minecraft:${entity}`] || 0;
  }

  clear(type) {
    this.achievements[type] = { stages: {} }
  }

  set(ach) {
    this.achievements[ach.type].stages[ach.stage] = {
      score: ach.score,
      limit: ach.limit,
      percentage: Math.min(Math.floor((ach.score / ach.limit) * 100), 100),
      isDone: ach.score >= ach.limit
    };
    
    const doneStages = Object.values(this.achievements[ach.type].stages)
    .filter(stage => stage.isDone)
    .length;

    this.achievements[ach.type].doneStages = doneStages
    this.achievements[ach.type].symbol = this.getRomanianNumber(doneStages);
    this.achievements.processed = Date.now();
  }

  async use(achievement) {
    if (!achievement)
      return 404;

    if (!['casual', 'defence', 'killer', 'event', 'donate', 'hammer'].includes(achievement))
      return 403;

    if (this.achievements?.[achievement]?.doneStages < 5)
      return 401;

    this.achievements.active = achievement;
    await this.player.save();
    return 200;
  }

  getRomanianNumber(number) {
    switch (number) {
      case 0:
        return '0'
      case 1:
        return 'I'
      case 2:
        return 'II'
      case 3:
        return 'III'
      case 4:
        return 'IV'
      case 5:
        return 'V'
    }
  }
}