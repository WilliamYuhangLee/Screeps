util = require("util");
module.exports = function () {
    let harvester = [WORK, CARRY, MOVE];
    let builder = [WORK, CARRY, MOVE];
    let upgrader = [WORK, WORK, CARRY, MOVE, MOVE, MOVE];
    let repairer = [WORK, CARRY, MOVE];
    StructureSpawn.prototype.spawnCustomCreep = function (energy, roleName) {
        let body = [];
        switch (roleName) {
            case "harvester":
                for (let i = 0; i < Math.floor(energy / util.bodyCost(harvester)); i++) {
                    body = body.concat(harvester);
                }
                break;
            case "builder":
                for (let i = 0; i < Math.floor(energy / util.bodyCost(builder)); i++) {
                    body = body.concat(builder);
                }
                break;
            case "upgrader":
                for (let i = 0; i < Math.floor(energy / util.bodyCost(upgrader)); i++) {
                    body = body.concat(upgrader);
                }
                break;
            case "repairer":
                for (let i = 0; i < Math.floor(energy / util.bodyCost(repairer)); i++) {
                    body = body.concat(repairer);
                }
                break;
            default:
                for (let i = 0; i < Math.floor(energy / util.bodyCost(harvester)); i++) {
                    body = body.concat(harvester);
                }
                break;
        }
        if (!body) return -6;
        let name = 1;
        while (Game.creeps[roleName + name]) {
            name++;
        }
        return this.spawnCreep(body, roleName + name, { memory: {role: roleName}});
    }
};