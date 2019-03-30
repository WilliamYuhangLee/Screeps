module.exports = function () {
    StructureSpawn.prototype.spawnRole = function (roleName) {
        modules.roles[roleName].spawn(this);
    }
};