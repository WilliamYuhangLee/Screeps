const body = [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE];
const roleName = "miner";

/**
 * Spawn a creep as a miner from the designated spawn.
 *
 * @param {StructureSpawn} spawn
 */
function spawn(spawn) {
    let target = spawn.pos.findClosestByPath(Object.keys(spawn.room.memory.containers).map(id => Game.getObjectById(id)),
        { filter: (s) => spawn.room.memory.containers[s.id] == null });
    if (!target) {
        return ERR_NO_UNASSIGNED_CONTAINER;
    }
    let name = modules.util.genName(roleName);
    let result = spawn.spawnCreep(body, name, { memory: {
            role: roleName,
            targetID: target.id,
        }
    });
    if (result === 0) {
        spawn.room.memory.containers[target.id] = name;
    }
    return result;
}

function run(creep) {
    let target = Game.getObjectById(creep.memory.targetID);
    if (creep.pos.getRangeTo(target) !== 0) {
        creep.moveTo(target);
    } else {
        creep.harvest(creep.pos.findClosestByPath(FIND_SOURCES));
    }
}

function clear(creepName) {
    let targetID = Memory.creeps[creepName].targetID;
    let container = Game.getObjectById(targetID);
    container.room.memory.containers[targetID] = null;
    delete Memory.creeps[creepName];
}

module.exports = {
    spawn: spawn,
    run: run,
    clear: clear,
};