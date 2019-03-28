/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function (creep) {
        if (creep.carry.energy === 0) {
            creep.memory.collecting = true;
        } else if (creep.carry.energy === creep.carryCapacity) {
            creep.memory.collecting = false;
        }
        if (creep.memory.collecting) {
            require("prototype.creep")();
            creep.collectFromStockpile();
        } else {
            if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};