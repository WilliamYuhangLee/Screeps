/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

var roleBuilder = require("role.builder");

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
            if (Game.spawns["origin"].energy < Game.spawns["origin"].energyCapacity) {
                if (creep.transfer(Game.spawns["origin"], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns["origin"]);
                }
            } else {
                roleBuilder.run(creep);
            }
        }
    }
};