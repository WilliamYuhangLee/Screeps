function init(room) {
    Memory.rooms[room.name] = {};
    let memory = Memory.rooms[room.name];
    memory.containers = {};
    room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_CONTAINER}).map(c => {
        memory.containers[c.id] = null;
    });
}

function update(room) {
    let memory = room.memory;
    room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_CONTAINER}).map(c => {
        memory.containers[c.id] = memory.containers[c.id] || null;
    });
}

function main() {
    if (!Memory.rooms) {
        Memory.rooms = {};
    }
    for (let key in Game.rooms) {
        let room = Game.rooms[key];
        if (!room.memory) {
            init(room);
        }
        update(room);
    }
}

module.exports = main;