# A simple data normalizer to be used with neural networks

As my grandfather used to say (probably), **neural networks** are dumb. When they're born and when you need to train them just to see how all the magic works, its a pain in the... neck.

This is library **convert datasets of human data** into **arrays of bits** understandable for neurons (duh).

*Disclaimer*:
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

```
$ (console output)
{ soilhum: { type: 'number', min: 300, max: 1050, distinctValues: null },
  airtemp: { type: 'number', min: 8, max: 103, distinctValues: null },
  airhum: { type: 'number', min: 18, max: 90, distinctValues: null },
  water: { type: 'boolean', min: 0, max: 1, distinctValues: null },
  plants:
   { type: 'array',
     min: null,
     max: null,
     distinctValues: [ 'tomatoes', 'potatoes', 'asparagus', 'french fries' ] } }

[ [ 0.266667, 0.252632, 0, 1, 1, 0, 0 ],
  [ 1, 0.336842, 0.041667, 0, 1, 1, 0 ],
  [ 0, 0.968421, 1, 1, 0, 1, 0 ],
  [ 0.866667, 1, 0.111111, 0, 0, 1, 0 ],
  [ 1, 0, 0.111111, 1, 0, 0, 0 ],
  [ 1, 0.505263, 0.111111, 0, 1, 0, 1 ] ]

[ [ 1 ], [ 1 ], [ 0 ], [ 1 ], [ 1 ], [ 1 ] ]
```

## Why metadata ?

Consider  a real example where you actually started to understand what are neural networks and start implementing it. You realize the biggest challenge is data formatting. When you **activate Alfred** with you data (i always call my network Alfred)
you realize you also need to **normalize the new data input** as well.

So you need to save metadata information that you got earlier (mins, maxes, ets) so that our data normalizer here converts the new inputs to the same scales! (this implies training data MUST contain min and maxes values at some point).

Then on new unkown input you just have to recall the normalizer one thing: *metadata of known values* range.

```
const normalizer = new Normalizer(newData);

normalizer
    .setDatasetMetaData(networkObject.metadata)
    .setOutputProperties(['water']);

const input = normalizer.getBinaryInputDataset()[0];

// and activate your neural network with data ! (see index.ts for an example using synaptic)
```
