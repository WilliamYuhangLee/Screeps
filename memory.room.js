/**
 * Initialize the memory storage for a new container.
 * Stores meta info about the container (e.g. source/mineral nearby) and set up storage targets.
 *
 * @param {StructureContainer} container
 */
function initMemoryContainer(container) {
    let source = container.pos.findInRange(FIND_SOURCES, 1)[0];
    let mineral = container.pos.findInRange(FIND_MINERALS, 1)[0];
    let controller = container.pos.inRangeTo(container.room.controller.pos, 4);

    let miner = source || mineral ? null : undefined;

    let sourceID = undefined;
    if (source) {
        sourceID = source.id;
    }
    if (mineral) {
        sourceID = mineral.id;
    }

    let threshold = {};
    if (source) {
        threshold[RESOURCE_ENERGY] = 0;
    }
    if (mineral) {
        threshold[mineral.mineralType] = 0;
    }
    if (controller) {
        threshold[RESOURCE_ENERGY] = container.storeCapacity;
    }
    if (_.isEmpty(threshold)) {
        threshold[RESOURCE_ENERGY] = container.storeCapacity;
    }

    return {
        threshold: threshold,
        miner: miner,
        sourceID: sourceID,
    };
}

/**
 * Initialize the memory storage for a new room
 *
 * @param {Room} room
 */
function init(room) {
    Memory.rooms[room.name] = {};
    let memory = Memory.rooms[room.name];

    memory.containers = {};
    room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_CONTAINER}).map(c => {
        memory.containers[c.id] = initMemoryContainer(c);
    });
}

function update(room) {
    let memory = room.memory;
    for (let container in memory.containers) {
        if (!Game.getObjectById(container)) {
            delete memory.containers[container];
        }
    }
    room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_CONTAINER}).map(c => {
        if (memory.containers[c.id] === undefined) {
            memory.containers[c.id] = initMemoryContainer(c);
        }
    });
}

/**
 * Handle memory management of a room.
 *
 * @param {Room} room
 */
function handle(room) {
    if (!Memory.rooms) {
        Memory.rooms = {};
    }
    if (!room.memory) {
        init(room);
    } else if (Game.time % 50 === 0) {
        update(room);
    }
}

module.exports = {
    handle: handle,
};