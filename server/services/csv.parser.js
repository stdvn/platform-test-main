import { parse } from 'csv-parse';
import fs from 'fs';
import { getImageDimensions } from './image';

function parseCsvToJson(file) {
    return new Promise(async (resolve) => {
        const data = [];
        const errors = [];

        const csvStream = fs.createReadStream(file.path)
            .pipe(parse({
                delimiter: ';',
                headers: ['id', 'name', 'url'],
                skipLines: 1,
            }))
            ;

        for await (const csvLine of csvStream) {
            if (csvLine[0] === 'id' && csvLine[1] === 'name' && csvLine[2] === 'url') {
                // Since following options
                // headers: ['id', 'name', 'url'],
                // skipLines: 1,
                // passed in csv parser object doesn't work to skip header line
                // in data returned as it is described in doc
                // We skip the header line here
                continue;
            }
            try {
                const imageDimensions = await getImageDimensions(csvLine[2]);
                data.push({
                    id: csvLine[0],
                    name: csvLine[1],
                    picture: {
                        url: csvLine[2],
                        width: imageDimensions.width,
                        height: imageDimensions.height,
                    },
                });
            } catch (e) {
                errors.push({
                    id: csvLine[0],
                    message: e,
                });
            }
            
        }

        resolve({
            data: data,
            errors: errors,
        });
    })
    
  
}


module.exports = { parseCsvToJson }