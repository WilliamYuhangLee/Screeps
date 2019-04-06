function init(room) {
    Memory.rooms[room.name] = {};
    let memory = Memory.rooms[room.name];
    memory.containers = {};
    room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_CONTAINER}).map(c => {
        let source = c.pos.findInRange(FIND_SOURCES, 1);
        memory.containers[c.id] = {
            threshold: source ? 0 : c.storeCapacity,
            miner: source ? null : undefined,
            sourceID: source ? source.id : undefined,
        };
    });
}

function update(room) {
    let memory = room.memory;
    room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_CONTAINER}).map(c => {
        let source = c.pos.findInRange(FIND_SOURCES, 1);
        if (memory.containers[c.id] === undefined) {
            memory.containers[c.id] = {
                threshold: source ? 0 : c.storeCapacity,
                miner: source ? null : undefined,
                sourceID: source ? source.id : undefined,
            };
        }
        if (memory.containers[c.id].threshold === undefined) memory.containers[c.id].threshold = source ? 0 : c.storeCapacity;
        if (memory.containers[c.id].sourceID === undefined) memory.containers[c.id].sourceID = source ? source[0].id : undefined;
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
        if (Game.time % 50 === 0) {
            update(room);
        }
    }
}

module.exports = main;