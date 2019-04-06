const body = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
const roleName = "upgrader";

/**
 * Spawn a creep as an upgrader from the designated spawn.
 *
 * @param {StructureSpawn} spawn
 * @param {Object} [opts] an Object with additional options for the spawning process
 * @param {string} [opts] the name of the new creep's home Room
 */
function spawn(spawn, opts) {
    let args = {
        memory: {
            role: roleName,
            home: spawn.room.name,
        },
    };
    if (opts) {
        if (opts instanceof Object) {
            _.merge(args, opts);
        } else if (typeof opts === "string" && Game.map.isRoomAvailable(opts)) {
            args.memory.home = opts;
        } else {
            return ERR_INVALID_ARGS;
        }
    }
    return spawn.spawnCreep(body, modules.util.genName(roleName, args.memory.home), args);
}

/**
 * Instructions to be executed by the creep per tick.
 *
 * @param {Creep} creep
 */
function run(creep) {
    if (creep.memory.home) {
        if (creep.room.name !== creep.memory.home) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.home));
            return;
        }
    }
    if (creep.carry.energy === 0) {
        creep.memory.collecting = true;
    } else if (creep.carry.energy === creep.carryCapacity) {
        creep.memory.collecting = false;
    }
    if (creep.memory.collecting) {
        creep.collectFromStockpile();
    } else {
        let target = creep.room.controller;
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

/**
 * Clear out the creep's storage from Memory
 *
 * @param {string} creepName
 */
function clear(creepName) {
    delete Memory.creeps[creepName];
}

module.exports = {
    spawn: spawn,
    run: run,
    clear: clear,
};