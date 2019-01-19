/**
 * Convert any input data to bits representation.
 *
 * @author Romain Bruckert
 */
export type RowInput = {
    [prop: string]: string|number|Array<string|number>|boolean;
};

function isArray(input: any)
{
    return ( Object.prototype.toString.call(input) === '[object Array]' ) ? true : false;
}

export class Normalizer
{
    private dataset: Array<RowInput|any> = [];
    private datasetMeta: any = null;                  // training meta data (ranges, min, max, etc)
    private binaryInput: Array<Array<any>> = [];
    private binaryOutput: Array<number> = [];
    private outputProperties: Array<string> = [];

    constructor(data: Array<RowInput> = [])
    {
        this.dataset = data;

        // prevent empty data input
        if (true !== Array.isArray(data)) {
            throw new Error('\x1b[37m\x1b[44mNormalizer input data should be an array of rows: [{...}, {...}]\x1b[0m')
        }

        // prevent empty data input
        if (this.dataset.length <= 0 ) {
            throw new Error(`\x1b[37m\x1b[44mNormalizer input data shouldn't be empty\x1b[0m`);
        }

        // prevent data rows to contain no properties
        if (Object.keys(this.dataset[0]).length <= 0) {
            throw new Error(`\x1b[37m\x1b[44mNormalizer input data rows has to contain some properties (only 1st row is checked)\x1b[0m`);
        }
    }

    getOutputLength()
    {
        return this.outputProperties.length;
    }

    getOutputProperties()
    {
        return this.outputProperties;
    }

    getInputLength()
    {
        return this.binaryInput[0].length;
    }

    getBinaryInputDataset()
    {
        return this.binaryInput;
    }

    getBinaryOutputDataset()
    {
        return this.binaryOutput;
    }

    getDatasetMetaData()
    {
        return this.datasetMeta;
    }

    setDatasetMetaData(metadata: any)
    {
        this.datasetMeta = metadata;
        return this;
    }

    convertOutput()
    {
        const metadata = this.datasetMeta;
    }

    normalize()
    {
        this.datasetMeta = (this.datasetMeta === null) ? this.analyzeMetaData() : this.datasetMeta;

        // now loop through data and convert any data to bits
        // depending on data type and known settings of metadata
        let binaryInput: Array<any> = [];
        let binaryOutput: Array<any> = [];

        for (let i in this.dataset) {
            const row = this.dataset[i];

            let index: number = 0;
            let inputBits: any = [];
            let outputBits: any = [];

            for (let prop in row) {
                // skip output properties, they are not in the input dataset
                // start turning all data into bits!
                let bitsArr: any;

                const value: any = row[prop];
                const meta = this.datasetMeta[prop];

                switch (meta.type) {
                    case 'number':
                        bitsArr = [this.numToBit(meta.min, meta.max, value)]; // scalar to array of 1 length
                    break;
                    case 'boolean':
                        bitsArr = [this.boolToBit(value)]; // scalar to array of 1 length
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
                } else {
                    inputBits = inputBits.concat(bitsArr);
                }

                index++;
            }

            if (inputBits.length > 0) { this.binaryInput.push(inputBits) }
            if (outputBits.length > 0) { this.binaryOutput.push(outputBits) }
        }

    }

    analyzeMetaData(): any
    {
        // at this point we know that data is not an empty array and
        // that the first row contains at least one property (the others should as well)

        // depending on each data row property, find the values data type using only the first row
        const firstRow = this.dataset[0];
        const distinctProps = this.distinctProps(firstRow);
        const distinctTypes = this.distinctTypes(firstRow);

        let metadata = {};
        let bitDataset = [];

        for (let prop of distinctProps) {
            const type = distinctTypes[prop];

            metadata[prop] = {
                type: type,
                min: null,
                max: null,
                distinctValues: null,
            };

            switch (type) {
                case 'number':
                    // data will be normalize with a number between 0 and 1
                    const minMax = this.getMinMax(prop, this.dataset);
                    metadata[prop].min = minMax[0];
                    metadata[prop].max = minMax[1];
                break;
                case 'boolean':
                // data is a simple 0 or 1 bit
                    metadata[prop].min = 0;
                    metadata[prop].max = 1;
                break;
                case 'string':
                    // data will be normalize in an array of bits which length is equivalent
                    // to the total number of distinct string values of the whole dataset
                    const distinctStrVals = this.getDistinctVals(prop, this.dataset);
                    metadata[prop].distinctValues = distinctStrVals;
                break;
                case 'array':
                    const distinctArrVals = this.getDistinctArrayVals(prop, this.dataset);
                    metadata[prop].distinctValues = distinctArrVals;
                break;
            }
        }

        return metadata;
    }

    setOutputProperties(props: Array<string>)
    {
        this.outputProperties = props;
        return this;
    }

    getMinMax(prop: string, data: Array<RowInput>): Array<number>
    {
        let min: number = null;
        let max: number = null;

        for (let i in data) {
            const val: any = data[i][prop];

            if (min === null || val < min) { min = val; }
            if (max === null || val > max) { max = val; }
        }

        return [min, max];
    }

    getDistinctVals(property: string, data: Array<RowInput>)
    {
        let count = 0;
        let distinctValues = [];

        for(let row of data) {
            const val = row[property];

            if (distinctValues.indexOf(val) === -1) {
                distinctValues.push(val);
            }
        }

        return distinctValues;
    }

    getDistinctArrayVals(property: string, data: Array<RowInput>)
    {
        let count = 0;
        let distinctValues = [];

        for(let row of data) {
            const arrVal: any = row[property];

            for (let val of arrVal) {
                if (distinctValues.indexOf(val) === -1) {
                    distinctValues.push(val);
                }
            }
            }

        return distinctValues;
    }

    numToBit(min: number, max: number, value: number): number
    {
        const num = (value - min) / (max - min);
        return Number((num).toFixed(6));
    }

    boolToBit(val: boolean)
    {
        return + val;
    }

    /**
     * Turns discint values into unique array of bits to represent them all.
     * For example if we have distinct data values of [ 500, 1050, 300, 950 ]
     * will will need a 4 length array of bits to represent them all.
     * The 1st value will be [0,0,0,1], the second [0,0,1,0]... and so on.
     * The methor
     */
    strToBitsArr(distinctValues: any, val: string)
    {
        let bitArr = new Array(distinctValues.length);
        bitArr.fill(0);

        for (let i in distinctValues) {
            if (val === distinctValues[i]) {
                bitArr[i] = 1;
            }
        }

        return bitArr;
    }

    arrToBitsArr(distinctValues: any, vals: any)
    {
        let bitArr = new Array(distinctValues.length);
        bitArr.fill(0);

        for (let j in vals) {
            const val = vals[j];
            let idx = distinctValues.indexOf(val);
            bitArr[idx] = 1;
        }

        return bitArr;
    }

    distinctProps(row: RowInput)
    {
        return Object.keys(row);
    }

    distinctTypes(row: RowInput)
    {
        let distinctTypes = {};

        for (let prop in row) {
            const value = row[prop];

            // also check for "real" array or object type
            if (typeof value === 'object' && isArray(value)) {
                distinctTypes[prop] = 'array';
            } else if (typeof value === 'object') {
                distinctTypes[prop] = 'object';
            } else {
                distinctTypes[prop] = typeof(value);
            }
        }

        return distinctTypes;
    }

    getRow1stValue(row: RowInput)
    {
        return row[Object.keys(row)[0]];
    }
}
