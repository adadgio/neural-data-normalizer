"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var normalizer_1 = require("./normalizer");
var sampleData = [
    { "soilhum": 500, "airtemp": 32, "airhum": 18, "water": true, "plants": ["tomatoes", "potatoes"] },
    { "soilhum": 1050, "airtemp": 40, "airhum": 21, "water": true, "plants": ["potatoes", "asparagus"] },
    { "soilhum": 300, "airtemp": 100, "airhum": 90, "water": false, "plants": ["asparagus", "tomatoes"] },
    { "soilhum": 950, "airtemp": 103, "airhum": 26, "water": true, "plants": ["asparagus", "asparagus"] },
    { "soilhum": 1050, "airtemp": 8, "airhum": 26, "water": true, "plants": ["tomatoes", "tomatoes"] },
    { "soilhum": 1050, "airtemp": 56, "airhum": 26, "water": true, "plants": ["potatoes", "french fries"] },
];
var normalizer = new normalizer_1.Normalizer(sampleData);
normalizer.setOutputProperties(['water']);
normalizer.normalize();
var nbrInputs = normalizer.getInputLength();
var nbrOutputs = normalizer.getOutputLength();
var metadata = normalizer.getDatasetMetaData();
var inputs = normalizer.getBinaryInputDataset();
var outputs = normalizer.getBinaryOutputDataset();
console.log('\n', '\x1b[37m\x1b[46m', 'METADATA:', '\x1b[0m');
console.log(metadata);
console.log('\n', '\x1b[37m\x1b[42m', 'INPUT:', '\x1b[0m');
console.log(inputs);
console.log('\n', '\x1b[37m\x1b[44m', 'OUTPUT:', '\x1b[0m');
console.log(outputs);
//# sourceMappingURL=index.js.map