/**
 * Test and examples.
 * Notes: does only work if inputs and outputs rows are
 * always of the same length. You cant ommit one field in sampleData[2] for instance.
 * NULL and empty values are not really handled and can cause bugs, but i guess
 * its probably your job to normalize that data before ?
 *
 * @author Romain Bruckert
 */
import { RowInput, Normalizer } from './normalizer';

const sampleData: Array<RowInput> = [
    { "soilhum": 500, "airtemp": 32, "airhum": 18, "water": true, "plants": ["tomatoes", "potatoes"] },
    { "soilhum": 1050, "airtemp": 40, "airhum": 21, "water": true, "plants": ["potatoes", "asparagus"] },
    { "soilhum": 300, "airtemp": 100, "airhum": 90, "water": false, "plants": ["asparagus", "tomatoes"] },
    { "soilhum": 950, "airtemp": 103, "airhum": 26, "water": true, "plants": ["asparagus", "asparagus"] },
    { "soilhum": 1050, "airtemp": 8, "airhum": 26, "water": true, "plants": ["tomatoes", "tomatoes"] },
    { "soilhum": 1050, "airtemp": 56, "airhum": 26, "water": true, "plants": ["potatoes", "french fries"] },
];

const normalizer = new Normalizer(sampleData);

// setting required options and normalize the data
normalizer.setOutputProperties(['water'])
normalizer.normalize()

// find useful information about your data
// to pass to your neural network

// check input and output lenghtes
const nbrInputs = normalizer.getInputLength()
const nbrOutputs = normalizer.getOutputLength()

const metadata = normalizer.getDatasetMetaData()
const inputs = normalizer.getBinaryInputDataset()
const outputs = normalizer.getBinaryOutputDataset()

console.log('\n', '\x1b[37m\x1b[46m', 'METADATA:', '\x1b[0m')
console.log(metadata)
console.log('\n', '\x1b[37m\x1b[42m', 'INPUT:', '\x1b[0m')
console.log(inputs)
console.log('\n', '\x1b[37m\x1b[44m', 'OUTPUT:', '\x1b[0m')
console.log(outputs)

// and pass that to the network (see synaptic.js)
// const network = new Architect.Perceptron(nbrInputs, 7, nbrOutputs);
// const trainer = new Trainer(network);

// let normalizedTrainingSet = [];
// for (let i in inputs) {
//     normalizedTrainingSet.push({
//         input: inputs[i],
//         output: outputs[i],
//     });
// }
