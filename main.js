require("global")();
require("prototype.spawn")();
require("prototype.creep")();

const profiler = require("screeps-profiler");
// Switch for turning on profiler
profiler.enable();

module.exports.loop = function () {
    profiler.wrap(function () {

        require("room")();

        require("cleanup")();

        let numberOfRolesWanted = {
            "harvester": 2,
            "builder": 2,
            "upgrader": 4,
            "repairer": 2,
            "miner": Object.keys(Game.spawns["origin"].room.memory.containers).length,
        };

        for (let role in numberOfRolesWanted) {
            let number = _.sum(Game.creeps, (creep) => creep.memory.role === role);
            if (number < numberOfRolesWanted[role]) {
                let result = Game.spawns["origin"].spawnRole(role);
                if (result === 0) break;
            }
        }

        for (let name in Game.creeps) {
            Game.creeps[name].run();
        }
    })
};