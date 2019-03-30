function main() {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            modules.roles[Memory.creeps[name].role].clear(name);
        }
    }
}

module.exports = main;