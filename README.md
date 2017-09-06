# A simple data normalizer to be used with neural networks

As my grandfather used to say (probably), Neural networks are dumb.

When they're born and when you need to train them just to see how all the magic works, its a pain in the... neck.

This is what this library is for. It **convert datasets** of human data into **arrays of bits** understandable for neurons.

**Disclaimer**

This script was made when i tested the awesome ()[]synaptic.js neural library and might not suit all sorts of inputs. Its mainly meant to be able to quickly have test data from example given around the web for neural networks input.

# Cut the crap, show me how to

Consider this. I'm trying to plug a neural network into my Arduino Connected Garden and i've got the following data. I want my network to know when or when not to water my plants on its own (whatever the units are for now).

```json
{ "soilhum": 500, "airtemp": 32, "airhum": 18, "water": true, "plants": ["tomatoes", "potatoes"] },
{ "soilhum": 1050, "airtemp": 40, "airhum": 21, "water": true, "plants": ["potatoes", "asparagus"] },
{ "soilhum": 300, "airtemp": 100, "airhum": 90, "water": false, "plants": ["asparagus", "tomatoes"] },
{ "soilhum": 950, "airtemp": 103, "airhum": 26, "water": true, "plants": ["asparagus", "asparagus"] },
{ "soilhum": 1050, "airtemp": 8, "airhum": 26, "water": true, "plants": ["tomatoes", "tomatoes"] },
{ "soilhum": 1050, "airtemp": 56, "airhum": 26, "water": true, "plants": ["potatoes", "french fries"] },
```
