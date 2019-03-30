function init(room) {
    Memory.rooms[room.name] = {};
    let memory = Memory.rooms[room.name];
    memory.containers = {};
    room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_CONTAINER}).map(c => {
        memory.containers[c.id] = { miner: null, collector: null };
    });
}

function update(room) {
    let memory = room.memory;
    room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_CONTAINER}).map(c => {
        if (memory.containers[c.id] === undefined) memory.containers[c.id] = { miner: null, collector: null };
        if (memory.containers[c.id].miner === undefined) memory.containers[c.id].miner = null;
        if (memory.containers[c.id].collector === undefined) memory.containers[c.id].collector = null;
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