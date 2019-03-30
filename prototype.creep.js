module.exports = function () {
    Creep.prototype.collectFromStockpile = function () {

        let sources = [
            [FIND_STRUCTURES, (s => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > this.getActiveBodyparts(WORK) * 4)],
            [FIND_TOMBSTONES, (t => t.store[RESOURCE_ENERGY] > 0)],
            [FIND_DROPPED_RESOURCES, (r => r.resourceType === RESOURCE_ENERGY)],
        ];

        if (this.getActiveBodyparts(WORK) > 0) {
            sources.push([FIND_SOURCES_ACTIVE, (() => true)]);
        }

        sources = sources.map(pair => this.room.find(pair[0], {filter: pair[1]})).filter(Boolean);

        let source = this.pos.findClosestByPath([].concat.apply([], sources));
        if (source instanceof Source) {
            if (this.harvest(source) === ERR_NOT_IN_RANGE) {
                this.moveTo(source);
            }
        } else if (source instanceof Resource) {
            if (this.pickup(source) === ERR_NOT_IN_RANGE) {
                this.moveTo(source);
            }
        } else {
            if (this.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(source);
            }
        }
    };

    Creep.prototype.run = function () {
        modules.roles[this.memory.role].run(this);
    };
};