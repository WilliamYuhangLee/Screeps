require("prototype.spawn")();
require("prototype.creep")();

let modules = {
    roles: {
        harvester: require("role.harvester"),
        builder: require("role.builder"),
        upgrader: require("role.upgrader"),
        repairer: require("role.repairer"),
        miner: require("role.miner"),
    }
};

const profiler = require("screeps-profiler");
// Switch for turning on profiler
profiler.enable();

module.exports.loop = function () {
    profiler.wrap(function () {

        require("room")();

        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                if (Memory.creeps[name].role === "miner") {
                    modules.roles[Memory.creeps[name].role].clear(name);
                } else {
                    delete Memory.creeps[name];
                }
            }
        }

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
                if (role !== "miner" && role !== "builder") {
                    let result = Game.spawns["origin"].spawnCustomCreep(Game.spawns["origin"].room.energyCapacityAvailable, role);
                    if (result === 0) break;
                } else {
                    let result = modules.roles[role].spawn(Game.spawns["origin"]);
                    if (result === 0) break;
                }
            }
        }

        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            modules.roles[creep.memory.role].run(creep);
        }
    })
};