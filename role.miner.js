const body = [WORK, WORK, WORK, WORK, WORK, WORK, MOVE];
const roleName = "miner";

/**
 * Spawn a creep as a miner from the designated spawn.
 *
 * @param {StructureSpawn} spawn
 */
function spawn(spawn) {
    let target = spawn.pos.findClosestByPath(Object.keys(spawn.room.memory.containers).map(id => Game.getObjectById(id)),
        { filter: (s) => spawn.room.memory.containers[s.id].miner == null && !!s.pos.findInRange(FIND_SOURCES, 1)});
    if (!target) {
        return ERR_NO_UNASSIGNED_CONTAINER;
    }
    let name = modules.util.genName(roleName);
    let result = spawn.spawnCreep(body, name, { memory: {
            role: roleName,
            targetID: target.id,
            sourceID: target.pos.findClosestByPath(FIND_SOURCES).id,
        }
    });
    if (result === 0) {
        spawn.room.memory.containers[target.id].miner = name;
    }
    return result;
}

function run(creep) {
    let container = Game.getObjectById(creep.memory.targetID);
    if (creep.pos.getRangeTo(container) !== 0) {
        creep.moveTo(container);
    } else {
        if (_.sum(container.store) < container.storeCapacity) {
            let found = creep.pos.lookFor(LOOK_RESOURCES);
            if (found) {
                creep.pickup(found[0]);
            }
            creep.harvest(Game.getObjectById(creep.memory.sourceID));
        }
    }
}

function clear(creepName) {
    let targetID = Memory.creeps[creepName].targetID;
    Game.getObjectById(targetID).room.memory.containers[targetID].miner = null;
    delete Memory.creeps[creepName];
}

module.exports = {
    spawn: spawn,
    run: run,
    clear: clear,
};