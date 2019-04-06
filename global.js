module.exports = function () {

    global.modules = {
        roles: {
            harvester: require("role.harvester"),
            builder: require("role.builder"),
            upgrader: require("role.upgrader"),
            repairer: require("role.repairer"),
            miner: require("role.miner"),
            collector: require("role.collector"),
            claimer: require("role.claimer"),
        },
        util: require("util"),
        room: require("room"),
    };

    /**
     * @constant
     * @type {number}
     */
    global.ERR_NO_UNASSIGNED_CONTAINER = -100;
};
