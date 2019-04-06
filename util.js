module.exports = {

    bodyCost: function (body) {
        return body.reduce(function (cost, part) {
            return cost + BODYPART_COST[part];
        }, 0);
    },

    genName: function (roleName, roomName) {
        if (roomName) {
            roomName = "[" + roomName + "]";
        } else {
            roomName = "";
        }
        let number = 1;
        while (Game.creeps[roomName + roleName + number]) {
            number++;
        }
        return roomName + roleName + number;
    }
};