util = require("util");
module.exports = function () {
    let bodies = {
        "harvester": [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
        "builder": [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
        "upgrader": [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
        "repairer": [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
        "miner": [WORK, WORK, WORK, WORK, WORK, MOVE],
    };
    StructureSpawn.prototype.spawnCustomCreep = function (energy, roleName) {
        let body = [];
        for (let i = 0; i < Math.floor(energy / util.bodyCost(bodies[roleName])); i++) {
            body = body.concat(bodies[roleName]);
        }
        if (!body) return -6;
        let name = 1;
        while (Game.creeps[roleName + name]) {
            name++;
        }
        return this.spawnCreep(body, roleName + name, { memory: {role: roleName}});
    }
};