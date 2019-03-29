function init(room) {
    // technically not just init, also check for existence (thus change)
    if (!Memory.rooms[room.name]) {
        Memory.rooms[room.name] = {};
    }
    let memory = Memory.rooms[room.name];

    if (!memory.containers) {
        memory.containers = {};
    }
    let containers = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_CONTAINER});
    for (let i in containers) {
        memory.containers[containers[i].id] = null;
    }
}

function main() {
    if (!Memory.rooms) {
        Memory.rooms = {};
    }
    for (let key in Game.rooms) {
        if (!Game.rooms[key].memory || true /* for development */) {
            init(Game.rooms[key]);
        }
    }
}

module.exports = main;