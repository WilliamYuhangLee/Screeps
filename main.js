require("prototype.spawn")();

module.exports.loop = function () {

    require("room")();

    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            if (Memory.creeps[name].role === "miner") {
                require("role.miner").clear(name);
            } else {
                delete Memory.creeps[name];
            }
        }
    }

    let numberOfRolesWanted = {
        "harvester": 3,
        "builder": 6,
        "upgrader": 6,
        "repairer": 2,
        "miner": Object.keys(Game.spawns["origin"].room.memory.containers).length,
    };

    for (let role in numberOfRolesWanted) {
        let number = _.sum(Game.creeps, (creep) => creep.memory.role === role);
        if (number < numberOfRolesWanted[role]) {
            if (role !== "miner") {
                let result = Game.spawns["origin"].spawnCustomCreep(Game.spawns["origin"].room.energyCapacityAvailable, role);
                if (result === 0) break;
            } else {
                let result = require("role." + role).spawn(Game.spawns["origin"]);
                if (result === 0) break;
            }
        }
    }

    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        require("role." + creep.memory.role).run(creep);
    }
};