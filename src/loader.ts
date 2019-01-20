import * as fs from 'fs'

/**
 * Load data from local file(s)
 *
 * @author Romain Bruckert
 */
export class Loader
{
    static fromJsonFile(filepath: string)
    {
        let data = fs.readFileSync(filepath, 'utf8')
        return JSON.parse(data)
    }

    fromCsvFile(filepath: string)
    {

    }
}
