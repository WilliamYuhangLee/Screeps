const body = [CARRY, CARRY, MOVE, MOVE];
const roleName = "collector";

/**
 * Spawn a creep as a collector from the designated spawn.
 *
 * @param {StructureSpawn} spawn
 */
function spawn(spawn) {
    let target = spawn.pos.findClosestByPath(Object.keys(spawn.room.memory.containers).map(id => Game.getObjectById(id)),
        { filter: (s) => spawn.room.memory.containers[s.id].collector == null });
    if (!target) {
        return ERR_NO_UNASSIGNED_CONTAINER;
    }
    let name = modules.util.genName(roleName);
    let result = spawn.spawnCreep(body, name, { memory: {
            role: roleName,
            targetID: target.id,
            waiting: 0,
        }
    });
    if (result === 0) {
        spawn.room.memory.containers[target.id].collector = name;
    }
    return result;
}

/**
 * Instructions to be executed by the creep per tick.
 *
 * @param {Creep} creep
 */
function run(creep) {
    if (_.sum(creep.carry) === 0) {
        creep.memory.collecting = true;
    } else if (_.sum(creep.carry) === creep.carryCapacity) {
        creep.memory.collecting = false;
    }
    if (creep.memory.collecting) {
        let targets = [];
        targets.push(Game.getObjectById(creep.memory.targetID));
        targets = targets.concat(creep.room.find(FIND_STRUCTURES, { filter: s =>
                s.structureType === STRUCTURE_CONTAINER && _.sum(s.store) > 0
        }));
        targets = targets.concat(creep.room.find(FIND_TOMBSTONES, { filter: t => _.sum(t.store) > 0}));
        targets = targets.concat(creep.room.find(FIND_DROPPED_RESOURCES));
        let target = creep.pos.findClosestByPath(targets);

        let withdrawResult;
        if (target instanceof Resource) {
            withdrawResult = creep.pickup(target);
        } else {
            withdrawResult = creep.withdraw(target, _.findKey(target.store));
        }
        if (withdrawResult === 0) {
            creep.memory.waiting = 0;
            return 0;
        }
        if (withdrawResult === ERR_NOT_IN_RANGE) {
            let moveResult = creep.moveTo(target);
            if (moveResult === 0) {
                creep.memory.waiting = 0;
                return 0;
            }
        }
        creep.memory.waiting++;
        if (creep.memory.waiting > 10 && _.sum(creep.carry) > creep.carryCapacity / 4) {
            creep.memory.collecting = false;
        }
    } else {
        let destination = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (s) => {
            return (s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity)
                || (s.structureType === STRUCTURE_SPAWN && s.energy < s.energyCapacity)
            }});
        if (_.sum(creep.carry) > creep.carry[RESOURCE_ENERGY]) {
            destination = creep.room.storage;
        }
        if (!destination) {
            destination = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (s) => {
                return s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity;
                }});
        }
        if (!destination) {
            if (creep.room.storage) {
                if (_.sum(creep.room.storage.store) < creep.room.storage.storeCapacity) {
                    destination = creep.room.storage;
                }
            }
        }
        if (!destination) {
            destination = creep.pos.findClosestByPath(FIND_MY_CREEPS, { filter: c => {
                let role = c.memory.role;
                return _.sum(c.carry) < c.carryCapacity
                    && (role === "builder" || role === "upgrader" || role === "repairer");
                }})
        }
        if (!destination) {
            creep.memory.waiting++;
        }
        let transferResult = creep.transfer(destination, _.findKey(creep.carry));
        if (transferResult === 0) {
            creep.memory.waiting = 0;
            return 0;
        }
        if (transferResult === ERR_NOT_IN_RANGE) {
            let moveResult = creep.moveTo(destination);
            if (moveResult === 0) {
                creep.memory.waiting = 0;
                return 0;
            }
        }
        creep.memory.waiting++;
        if (creep.memory.waiting > 10 && creep.carry[RESOURCE_ENERGY] < creep.carryCapacity) {
            creep.memory.collecting = true;
        }
    }
}

/**
 * Clear out the creep's storage from Memory
 *
 * @param {String} creepName
 */
function clear(creepName) {
    let targetID = Memory.creeps[creepName].targetID;
    Game.getObjectById(targetID).room.memory.containers[targetID].collector = null;
    delete Memory.creeps[creepName];
}

module.exports = {
    spawn: spawn,
    run: run,
    clear: clear,
};