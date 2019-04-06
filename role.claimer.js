const body = [CLAIM, MOVE];
const roleName = "claimer";

/**
 * Spawn a creep as a claimer from the designated spawn.
 *
 * @param {StructureSpawn} spawn: where the new creep is spawned
 * @param {Object} [opts] an Object with additional options for the spawning process
 * @param {string} [opts] the name of target room or flag
 */
function spawn(spawn, opts) {
    let args = {
        memory: {
            role: roleName,
            target: null,
        },
    };
    if (opts) {
        if (opts instanceof Object) {
            _.merge(args, opts);
        } else if (typeof opts === "string" && (Game.map.isRoomAvailable(opts) || Game.flags[opts])) {
            args.memory.target = opts;
        } else {
            return ERR_INVALID_ARGS;
        }
    }
    return spawn.spawnCreep(body, modules.util.genName(roleName, args.memory.target), args);
}

/**
 * Instructions to be executed by the creep per tick.
 *
 * @param {Creep} creep
 */
function run(creep) {
    let targetName = creep.memory.target;

    if (!targetName) {
        console.log(`${creep.name} needs a target to claim!`);
        return;
    }

    let roomName;
    if (Game.map.isRoomAvailable(targetName)) {
        roomName = targetName;
    } else {
        let flag = Game.flags[targetName];
        if (!flag) {
            console.log(`${creep.name} has an invalid target!`);
            return;
        } else {
            roomName = flag.pos.roomName;
        }
    }

    if (creep.room.name === roomName) {
        let room = Game.rooms[roomName];
        if (creep.pos.isNearTo(room.controller)) {
            creep.claimController(room.controller);
            creep.signController(room.controller, "New Frontier for Creeptographers!");
        } else {
            creep.moveTo(room.controller);
        }
    } else {
        creep.moveTo(new RoomPosition(25, 25, roomName));
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