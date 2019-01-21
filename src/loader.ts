import * as fs from 'fs'

/**
 * Load data from local file(s)
 *
 * @author Romain Bruckert
 */
export class Loader
{
    dir: string;
    filename: string

    setDataDir(dir: string)
    {
        this.dir = dir

        return this
    }

    fromJsonFile(filename: string)
    {
        this.filename = filename

        let path = `${this.dir}/${filename}`.replace('//', '/')
        let data = fs.readFileSync(path, 'utf8')

        return JSON.parse(data)
    }

    fromCsvFile(filepath: string)
    {
        // @TODO
    }

    getTrainedData()
    {
        const filename = `trained_${this.filename}`
        const filepath = `${this.dir}/${filename}`.replace('//', '/')

        const data: string = fs.readFileSync(filepath, 'utf8')
        
        return JSON.parse(data)
    }

    saveTrainedData(data: any)
    {
        const filename = `trained_${this.filename}`
        const filepath = `${this.dir}/${filename}`.replace('//', '/')

        if (typeof data !==  'string') {
            data = JSON.stringify(data)
        }

        fs.writeFileSync(filepath, data)
    }

    dataIsTrained()
    {
        let filename = `trained_${this.filename}`
        let filepath = `${this.dir}/${filename}`.replace('//', '/')

        return fs.existsSync(filepath)
    }
}
