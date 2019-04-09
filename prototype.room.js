let spawnStrategies = {
    E42N15: {
        "miner": 2,
        "collector": 2,
        "repairer": 2,
        "builder": 2,
        "upgrader": 4,
    },
    E41N16: {
        "miner": 2,
        "collector": 2,
        "repairer": 2,
        "builder": 4,
        "upgrader": 4,
    },
};

/**
 * Execute actions according to strategy of this room
 */
function run() {
    let name = this.name;

    modules.memory.room.handle(this);

    if (this.controller.my) {
        // For owned rooms

        // Spawn creeps according to this room's spawn strategy
        let spawnStrategy = spawnStrategies[name];
        for (let role in spawnStrategy) {
            let numNow = _.sum(Game.creeps, c => c.memory.home === name && c.memory.role === role);
            if (numNow < spawnStrategy[role]) {
                let spawns = this.find(FIND_MY_SPAWNS, {filter: s => !s.spawning});
                if (spawns.length > 0) {
                    spawns[0].spawnRole(role);
                }
                break;
            }
        }

        // Order towers to attack if enemy is present
        let towers = this.find(FIND_MY_STRUCTURES, {filter: s => s.structureType === STRUCTURE_TOWER});
        for (let i in towers) {
            let tower = towers[i];
            let target = tower.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if (target) {
                tower.attack(target);
            }
        }

    } else {

    }
}

module.exports = function() {
    Room.prototype.run = run;
};