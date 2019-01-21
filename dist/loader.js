"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var Loader = (function () {
    function Loader() {
    }
    Loader.prototype.setDataDir = function (dir) {
        this.dir = dir;
        return this;
    };
    Loader.prototype.fromJsonFile = function (filename) {
        this.filename = filename;
        var path = (this.dir + "/" + filename).replace('//', '/');
        var data = fs.readFileSync(path, 'utf8');
        return JSON.parse(data);
    };
    Loader.prototype.fromCsvFile = function (filepath) {
    };
    Loader.prototype.getTrainedData = function () {
        var filename = "trained_" + this.filename;
        var filepath = (this.dir + "/" + filename).replace('//', '/');
        var data = fs.readFileSync(filepath, 'utf8');
        return JSON.parse(data);
    };
    Loader.prototype.saveTrainedData = function (data) {
        var filename = "trained_" + this.filename;
        var filepath = (this.dir + "/" + filename).replace('//', '/');
        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }
        fs.writeFileSync(filepath, data);
    };
    Loader.prototype.dataIsTrained = function () {
        var filename = "trained_" + this.filename;
        var filepath = (this.dir + "/" + filename).replace('//', '/');
        return fs.existsSync(filepath);
    };
    return Loader;
}());
exports.Loader = Loader;
