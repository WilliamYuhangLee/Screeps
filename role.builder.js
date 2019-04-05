const body = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
const roleName = "builder";

/**
 * Spawn a creep as a builder from the designated spawn.
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
        let construction = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
        if (construction) {
            if (creep.build(construction) === ERR_NOT_IN_RANGE) {
                creep.moveTo(construction);
            }
        } else {
            modules.roles["upgrader"].run(creep);
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