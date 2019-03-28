var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");

module.exports.loop = function () {
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role === "harvester") {
            roleHarvester.run(creep);
        } else if (creep.memory.role === "upgrader") {
            roleUpgrader.run(creep);
        } else if (creep.memory.role === "builder") {
            roleBuilder.run(creep);
        }
    }
};