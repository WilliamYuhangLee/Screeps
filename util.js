module.exports = {

    bodyCost: function (body) {
        return body.reduce(function (cost, part) {
            return cost + BODYPART_COST[part];
        }, 0);
    },

    genName: function (roleName) {
        let number = 1;
        while (Game.creeps[roleName + number]) {
            number++;
        }
        return roleName + number;
    }
};