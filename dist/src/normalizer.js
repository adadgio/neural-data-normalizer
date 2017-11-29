"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isArray(input) {
    return (Object.prototype.toString.call(input) === '[object Array]') ? true : false;
}
var Normalizer = (function () {
    function Normalizer(data) {
        if (data === void 0) { data = []; }
        this.dataset = [];
        this.datasetMeta = null;
        this.binaryInput = [];
        this.binaryOutput = [];
        this.outputProperties = [];
        this.dataset = data;
        if (this.dataset.length <= 0) {
            throw new Error("Normalizer input data shouldn't be empty");
        }
        if (Object.keys(this.dataset[0]).length <= 0) {
            throw new Error("Normalizer input data rows has to contain some properties (only 1st row is checked)");
        }
    }
    Normalizer.prototype.getOutputLength = function () {
        return this.outputProperties.length;
    };
    Normalizer.prototype.getOutputProperties = function () {
        return this.outputProperties;
    };
    Normalizer.prototype.getInputLength = function () {
        return this.binaryInput[0].length;
    };
    Normalizer.prototype.getBinaryInputDataset = function () {
        return this.binaryInput;
    };
    Normalizer.prototype.getBinaryOutputDataset = function () {
        return this.binaryOutput;
    };
    Normalizer.prototype.getDatasetMetaData = function () {
        return this.datasetMeta;
    };
    Normalizer.prototype.setDatasetMetaData = function (metadata) {
        this.datasetMeta = metadata;
        return this;
    };
    Normalizer.prototype.convertOutput = function () {
        var metadata = this.datasetMeta;
    };
    Normalizer.prototype.normalize = function () {
        this.datasetMeta = (this.datasetMeta === null) ? this.analyzeMetaData() : this.datasetMeta;
        var binaryInput = [];
        var binaryOutput = [];
        for (var i in this.dataset) {
            var row = this.dataset[i];
            var index = 0;
            var inputBits = [];
            var outputBits = [];
            for (var prop in row) {
                var bitsArr = void 0;
                var value = row[prop];
                var meta = this.datasetMeta[prop];
                switch (meta.type) {
                    case 'number':
                        bitsArr = [this.numToBit(meta.min, meta.max, value)];
                        break;
                    case 'boolean':
                        bitsArr = [this.boolToBit(value)];
                        break;
                    case 'string':
                        bitsArr = this.strToBitsArr(meta.distinctValues, value);
                        break;
                    case 'array':
                        bitsArr = this.arrToBitsArr(meta.distinctValues, value);
                        break;
                    default:
                        break;
                }
                if (this.outputProperties.indexOf(prop) > -1) {
                    outputBits = outputBits.concat(bitsArr);
                }
                else {
                    inputBits = inputBits.concat(bitsArr);
                }
                index++;
            }
            if (inputBits.length > 0) {
                this.binaryInput.push(inputBits);
            }
            if (outputBits.length > 0) {
                this.binaryOutput.push(outputBits);
            }
        }
    };
    Normalizer.prototype.analyzeMetaData = function () {
        var firstRow = this.dataset[0];
        var distinctProps = this.distinctProps(firstRow);
        var distinctTypes = this.distinctTypes(firstRow);
        var metadata = {};
        var bitDataset = [];
        for (var _i = 0, distinctProps_1 = distinctProps; _i < distinctProps_1.length; _i++) {
            var prop = distinctProps_1[_i];
            var type = distinctTypes[prop];
            metadata[prop] = {
                type: type,
                min: null,
                max: null,
                distinctValues: null,
            };
            switch (type) {
                case 'number':
                    var minMax = this.getMinMax(prop, this.dataset);
                    metadata[prop].min = minMax[0];
                    metadata[prop].max = minMax[1];
                    break;
                case 'boolean':
                    metadata[prop].min = 0;
                    metadata[prop].max = 1;
                    break;
                case 'string':
                    var distinctStrVals = this.getDistinctVals(prop, this.dataset);
                    metadata[prop].distinctValues = distinctStrVals;
                    break;
                case 'array':
                    var distinctArrVals = this.getDistinctArrayVals(prop, this.dataset);
                    metadata[prop].distinctValues = distinctArrVals;
                    break;
            }
        }
        return metadata;
    };
    Normalizer.prototype.setOutputProperties = function (props) {
        this.outputProperties = props;
        return this;
    };
    Normalizer.prototype.getMinMax = function (prop, data) {
        var min = null;
        var max = null;
        for (var i in data) {
            var val = data[i][prop];
            if (min === null || val < min) {
                min = val;
            }
            if (max === null || val > max) {
                max = val;
            }
        }
        return [min, max];
    };
    Normalizer.prototype.getDistinctVals = function (property, data) {
        var count = 0;
        var distinctValues = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var row = data_1[_i];
            var val = row[property];
            if (distinctValues.indexOf(val) === -1) {
                distinctValues.push(val);
            }
        }
        return distinctValues;
    };
    Normalizer.prototype.getDistinctArrayVals = function (property, data) {
        var count = 0;
        var distinctValues = [];
        for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
            var row = data_2[_i];
            var arrVal = row[property];
            for (var _a = 0, arrVal_1 = arrVal; _a < arrVal_1.length; _a++) {
                var val = arrVal_1[_a];
                if (distinctValues.indexOf(val) === -1) {
                    distinctValues.push(val);
                }
            }
        }
        return distinctValues;
    };
    Normalizer.prototype.numToBit = function (min, max, value) {
        var num = (value - min) / (max - min);
        return Number((num).toFixed(6));
    };
    Normalizer.prototype.boolToBit = function (val) {
        return +val;
    };
    Normalizer.prototype.strToBitsArr = function (distinctValues, val) {
        var bitArr = new Array(distinctValues.length);
        bitArr.fill(0);
        for (var i in distinctValues) {
            if (val === distinctValues[i]) {
                bitArr[i] = 1;
            }
        }
        return bitArr;
    };
    Normalizer.prototype.arrToBitsArr = function (distinctValues, vals) {
        var bitArr = new Array(distinctValues.length);
        bitArr.fill(0);
        for (var j in vals) {
            var val = vals[j];
            var idx = distinctValues.indexOf(val);
            bitArr[idx] = 1;
        }
        return bitArr;
    };
    Normalizer.prototype.distinctProps = function (row) {
        return Object.keys(row);
    };
    Normalizer.prototype.distinctTypes = function (row) {
        var distinctTypes = {};
        for (var prop in row) {
            var value = row[prop];
            if (typeof value === 'object' && isArray(value)) {
                distinctTypes[prop] = 'array';
            }
            else if (typeof value === 'object') {
                distinctTypes[prop] = 'object';
            }
            else {
                distinctTypes[prop] = typeof (value);
            }
        }
        return distinctTypes;
    };
    Normalizer.prototype.getRow1stValue = function (row) {
        return row[Object.keys(row)[0]];
    };
    return Normalizer;
}());
exports.Normalizer = Normalizer;
//# sourceMappingURL=normalizer.js.map