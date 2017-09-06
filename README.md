# A simple data normalizer to be used with neural networks

As my grandfather used to say (probably), **neural networks** are dumb. When they're born and when you need to train them just to see how all the magic works, its a pain in the... neck.

This is what this library is for. It **convert datasets of human data** into **arrays of bits** understandable for neurons.

*Disclaimer*
This script was made when i tested the awesome (https://github.com/cazala/synaptic)[synaptic.js] neural network elibrary and might not suit all sorts of inputs. Its mainly meant to be able to quickly have test data from example given around the web for neural networks input.

## Cut the crap, show me how to

Consider this. I'm trying to plug a neural network into my Arduino Connected Garden and i've got the following data. I want my network to know when or when not to water my plants on its own (whatever the units are for now).

```json
{ "soilhumidity": 500, "airtemp": 32, "airhum": 18, "water": true, "plants": ["tomatoes", "potatoes"] },
{ "soilhumidity": 1050, "airtemp": 40, "airhum": 21, "water": true, "plants": ["potatoes", "asparagus"] },
{ "soilhumidity": 300, "airtemp": 100, "airhum": 90, "water": false, "plants": ["asparagus", "tomatoes"] },
{ "soilhumidity": 950, "airtemp": 103, "airhum": 26, "water": true, "plants": ["asparagus", "asparagus"] },
{ "soilhumidity": 1050, "airtemp": 8, "airhum": 26, "water": true, "plants": ["tomatoes", "tomatoes"] },
{ "soilhumidity": 1050, "airtemp": 56, "airhum": 26, "water": true, "plants": ["potatoes", "french fries"] },
```

In the end, my output is "should i water the plants?": `water: true` and the rest are my inputs. Let's do this.

```ts
const normalizer = new Normalizer(sampleData);

// setting required options and normalize the data
normalizer.setOutputProperties(['water']);
normalizer.normalize();

// find useful information about your data
// to pass to your neural network
const nbrInputs = normalizer.getInputLength();
const nbrOutputs = normalizer.getOutputLength();

const metadata = normalizer.getDatasetMetaData();
const inputs = normalizer.getBinaryInputDataset();
const outputs = normalizer.getBinaryOutputDataset();

console.log(metadata);
console.log(inputs);
console.log(outputs);
```

There you should have all useful information to give to your network. You know the **number if inputs** and **outputs**, you get **~~binarized(?) dataset suitable for neural networks**, and event some *metadata* about your data.

## Why metadata ?
