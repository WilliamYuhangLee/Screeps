require("prototype.spawn")();

module.exports.loop = function () {

    require("room")();

    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) delete Memory.creeps[name];
    }

    let numberOfRolesWanted = {
        "harvester": 3,
        "builder": 6,
        "upgrader": 6,
        "repairer": 2,
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
        require("role." + creep.memory.role).run(creep);
    }
};