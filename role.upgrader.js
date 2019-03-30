const body = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
const roleName = "upgrader";

/**
 * Spawn a creep as an upgrader from the designated spawn.
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
        //TODO: remove temp solution hardcoded to upgrade origin room's controller
        let target = Game.spawns["origin"].room.controller;
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
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