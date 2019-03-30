const body = [WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
const roleName = "harvester";

/**
 * Spawn a creep as a harvester from the designated spawn.
 *
 * @param {StructureSpawn} spawn
 */
function spawn(spawn) {
    return spawn.spawnCreep(body, modules.util.genName(roleName), { memory: { role: roleName }});
}

/**
 * Instructions to be executed by the creep per tick.
 *
 * @param {Creep} creep
 */
function run(creep) {
    if (creep.carry.energy === 0) {
        creep.memory.collecting = true;
    } else if (creep.carry.energy === creep.carryCapacity) {
        creep.memory.collecting = false;
    }
    if (creep.memory.collecting) {
        creep.collectFromStockpile();
    } else {
        let target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (structure) => structure.energy < structure.energyCapacity
        });
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            modules.roles["upgrader"].run(creep);
        }
    }
}

/**
 * Clear out the creep's storage from Memory
 *
 * @param {String} creepName
 */
function clear(creepName) {
    delete Memory.creeps[creepName];
}

module.exports = {
    spawn: spawn,
    run: run,
    clear: clear,
};