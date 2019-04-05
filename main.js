require("global")();
require("prototype.spawn")();
require("prototype.creep")();

const profiler = require("screeps-profiler");

// Switch for turning on profiler
// profiler.enable();

module.exports.loop = function () {
    profiler.wrap(function () {

        require("room")();

        require("cleanup")();

        let numberOfRolesWanted = {
            "miner": Object.keys(Game.spawns["origin"].room.memory.containers).length,
            "collector": 2,
            "repairer": 2,
            "builder": 2,
            "upgrader": 4,
        };

        for (let role in numberOfRolesWanted) {
            let number = _.sum(Game.creeps, (creep) => creep.memory.role === role);
            if (number < numberOfRolesWanted[role]) {
                Game.spawns["origin"].spawnRole(role);
                break;
            }
        }

        for (let name in Game.creeps) {
            Game.creeps[name].run();
        }

        let towers = Game.spawns["origin"].room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_TOWER});

        for (let i in towers) {
            let tower = towers[i];
            let target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            tower.attack(target);
        }
    })
};