require("global")();
require("prototype.spawn")();
require("prototype.creep")();
require("prototype.room")();

const profiler = require("screeps-profiler");

// Switch for turning on profiler
// profiler.enable();

module.exports.loop = function () {
    profiler.wrap(function () {

        require("cleanup")();

        for (let i in Game.rooms) {
            let room = Game.rooms[i];
            room.run();
        }

        for (let name in Game.creeps) {
            Game.creeps[name].run();
        }
    })
};