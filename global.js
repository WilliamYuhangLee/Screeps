let modules = {
    roles: {
        harvester: require("role.harvester"),
        builder: require("role.builder"),
        upgrader: require("role.upgrader"),
        repairer: require("role.repairer"),
        miner: require("role.miner"),
    },
    util: require("util"),
};

let constants = {
    // role.miner
    ERR_NO_UNASSIGNED_CONTAINER: -100,
};

module.exports = function () {
    global.modules = modules;
    Object.assign(global, constants);
};
