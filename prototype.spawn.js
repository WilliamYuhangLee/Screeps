/**
 * Spawn a creep of the given role at this spawn.
 *
 * @param {string} roleName: the name of the creep's role
 * @param {Object} [opts] an Object with additional options for the spawning process
 * @param {string} [opts] a string parameter that serves specific purposes for each role
 *
 * @returns {Number} the result of the spawning process
 */
function spawnRole(roleName, opts) {
    return modules.roles[roleName].spawn(this, opts);
}

module.exports = function () {
    StructureSpawn.prototype.spawnRole = spawnRole;
};