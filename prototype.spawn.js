module.exports = function () {
    StructureSpawn.prototype.spawnRole = function (roleName) {
        return modules.roles[roleName].spawn(this);
    }
};