/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

global.ERR_NO_UNASSIGNED_CONTAINER = -100;

let body = [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE];
let roleName = "miner";

function spawn(spawn) {
    let targetID = undefined;
    let minDistance = Number.MAX_SAFE_INTEGER;
    for (const container in spawn.room.memory.containers) {
        if (spawn.room.memory.containers[container] == null && spawn.pos.getRangeTo(Game.getObjectById(container)) < minDistance) {
            targetID = container;
            minDistance = spawn.pos.getRangeTo(Game.getObjectById(container));
        }
    }
    if (!targetID) {
        return ERR_NO_UNASSIGNED_CONTAINER;
    }
    let name = 1;
    while (Game.creeps[roleName + name]) {
        name++;
    }
    name = roleName + name;
    let result = spawn.spawnCreep(body, name, { memory: {
            role: roleName,
            targetID: targetID,
        }
    });
    if (result === 0) {
        spawn.room.memory.containers[targetID] = name;
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