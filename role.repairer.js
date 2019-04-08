const body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
const roleName = "repairer";

/**
 * Spawn a creep as a repairer from the designated spawn.
 *
 * @param {StructureSpawn} spawn: where to spawn the new creep
 * @param {Object} [opts] an Object with additional options for the spawning process
 * @param {string} [opts] the name of the new creep's home room
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
    if (creep.room.name !== creep.memory.home) {
        return creep.moveTo(new RoomPosition(25, 25, creep.memory.home));
    }
    if (creep.carry.energy === 0) {
        creep.memory.collecting = true;
    } else if (creep.carry.energy === creep.carryCapacity) {
        creep.memory.collecting = false;
    }
    if (creep.memory.collecting) {
        creep.collectFromStockpile();
    } else {
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL
        });
        if (target) {
            if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            modules.roles["builder"].run(creep);
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