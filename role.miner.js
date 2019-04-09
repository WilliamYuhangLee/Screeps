const body = [WORK, WORK, WORK, WORK, WORK, WORK, MOVE];
const roleName = "miner";

/**
 * Spawn a creep as a miner from the designated spawn.
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
            targetID: null,
        },
    };
    if (opts) {
        if (opts instanceof Object) {
            _.merge(args, opts);
        } else if (typeof opts === "string" && Game.map.isRoomAvailable(opts)) {
            args.memory.home = opts;
        } else if (typeof opts === "string" && Game.getObjectById(opts) instanceof StructureContainer) {
            args.memory.targetID = opts;
            args.memory.home = Game.getObjectById(opts).room.name;
        } else {
            return ERR_INVALID_ARGS;
        }
    }
    let containers = Memory.rooms[args.memory.home].containers;
    if (!args.targetID || !(Game.getObjectById(args.targetID) instanceof StructureContainer)) {
        let targetIDs = Object.keys(containers).filter(c => containers[c].sourceID && !containers[c].miner);
        if (targetIDs.length === 0) return ERR_NO_UNASSIGNED_CONTAINER;
        let targets = targetIDs.map(c => {
            let container = Game.getObjectById(c);
            if (!container) delete containers[container.id];
            return container;
        });
        targets = targets.filter(Boolean);
        if (targets.length === 0) return ERR_NO_UNASSIGNED_CONTAINER;
        let target = spawn.pos.findClosestByPath(targets);
        if (target) {
            args.memory.targetID = target.id;
        } else {
            args.memory.targetID = _.min(targetIDs, id => _.sum(Game.getObjectById(id).store));
        }
    }
    args.memory.sourceID = containers[args.memory.targetID].sourceID;

    let name = modules.util.genName(roleName, args.memory.home);

    let result = spawn.spawnCreep(body, name, args);
    if (result === 0) {
        containers[args.memory.targetID].miner = name;
    }
    return result;
}

function run(creep) {
    if (creep.room.name !== creep.memory.home) {
        return creep.moveTo(new RoomPosition(25, 25, creep.memory.home));
    }
    let container = Game.getObjectById(creep.memory.targetID);
    if (!creep.pos.isEqualTo(container.pos)) {
        creep.moveTo(container);
    } else {
        if (_.sum(container.store) < container.storeCapacity) {
            let dropped = creep.pos.lookFor(LOOK_RESOURCES);
            if (dropped) {
                creep.pickup(dropped[0]);
            }
            creep.harvest(Game.getObjectById(creep.memory.sourceID));
        }
    }
}

function clear(creepName) {
    let memory = Memory.creeps[creepName];
    Memory.rooms[memory.home].containers[memory.targetID].miner = null;
    delete Memory.creeps[creepName];
}

module.exports = {
    spawn: spawn,
    run: run,
    clear: clear,
};