/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
var roleUpgrader = require("role.upgrader");

module.exports = {
    run: function (creep) {
        if (creep.carry.energy === 0) {
            creep.memory.collecting = true;
        } else if (creep.carry.energy === creep.carryCapacity) {
            creep.memory.collecting = false;
        }
        if (creep.memory.collecting) {
            let source = creep.pos.findClosestByRange(FIND_SOURCES);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        } else {
            let construction = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if (construction) {
                if (creep.build(construction) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(construction);
                }
            } else {
                roleUpgrader.run(creep);
            }
        }
    }
};