function init(room) {
    Memory.rooms[room.name] = {
        containers: {},
    };
    for (let container in room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_CONTAINER})) {
        room.memory.containers[container.id] = undefined;
    }
}

function main() {
    if (!Memory.rooms) {
        Memory.rooms = {};
    }
    for (let key in Game.rooms) {
        if (!Game.rooms[key].memory) {
            init(Game.rooms[key]);
        }
    }
}

module.exports = main;