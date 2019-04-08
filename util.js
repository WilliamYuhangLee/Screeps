function bodyCost(body) {
    return body.reduce(function (cost, part) {
        return cost + BODYPART_COST[part];
    }, 0);
}

function genName(roleName, roomName) {
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

/**
 * This method is like `min` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * the value is ranked. The iteratee is invoked with one argument: (value).
 *
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The iteratee invoked per element.
 * @returns {*} Returns the minimum value.
 *
 * @example
 * const objects = [{ 'n': 1 }, { 'n': 2 }]
 * minBy(objects, ({ n }) => n)
 * => { 'n': 1 }
 *
 */
function minBy(array, iteratee) {
    let result;
    if (array == null) {
        return undefined;
    }
    let computed;
    for (const value of array) {
        const current = iteratee(value);

        if (current !== null && current !== undefined && (computed === undefined || current < computed)) {
            computed = current;
            result = value;
        }
    }
    return result;
}

module.exports = {

    bodyCost: bodyCost,
    genName: genName,
    minBy: minBy,

};