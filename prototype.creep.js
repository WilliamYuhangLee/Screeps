module.exports = function () {
    Creep.prototype.collectFromStockpile = function () {

        let sources = [
            [FIND_STRUCTURES, (s => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0)],
            [FIND_TOMBSTONES, (t => t.store[RESOURCE_ENERGY] > 0)],
        ];

        if (this.getActiveBodyparts(WORK) > 0) {
            sources.push([FIND_SOURCES, (s => s.energy > 0)]);
        }

        sources = sources.map(pair => this.pos.findClosestByPath(pair[0], {filter: pair[1]})).filter(Boolean);

        let source = this.pos.findClosestByPath(sources);
        if (source instanceof Source) {
            if (this.harvest(source) === ERR_NOT_IN_RANGE) {
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