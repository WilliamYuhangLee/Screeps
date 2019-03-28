require("prototype.spawn")();

var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");
var roleRepairer = require("role.repairer");

module.exports.loop = function () {

    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) delete Memory.creeps[name];
    }

    let numberOfRolesWanted = {
        "harvester": 2,
        "builder": 4,
        "upgrader": 4,
        "repairer": 1,
    };

    for (let role in numberOfRolesWanted) {
        let number = _.sum(Game.creeps, (creep) => creep.memory.role === role);
        if (number < numberOfRolesWanted[role]) {
            let result = Game.spawns["origin"].spawnCustomCreep(Game.spawns["origin"].room.energyCapacityAvailable, role);
            if (!(result < 0)) break;
        }
    }

    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role === "harvester") {
            roleHarvester.run(creep);
        } else if (creep.memory.role === "upgrader") {
            roleUpgrader.run(creep);
        } else if (creep.memory.role === "builder") {
            roleBuilder.run(creep);
        } else if (creep.memory.role === "repairer") {
            roleRepairer.run(creep);
        }
    }
};