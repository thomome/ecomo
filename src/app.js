(() => {
    const input = document.querySelector('#input')
    const output = document.querySelector('#output')
    const analyze = document.querySelector('#analyze')

    const logger = new Logger(output)
    const csv = new CSV()
    const ecomo = new EcomoEvaluator();
    const dropzone = new Dropzone(input)

    logger.log(`------------`)
    logger.log(`ecomo v0.1.0`)
    logger.log(`------------`)
    
    
    analyze.addEventListener('click', async () => {
        const files = dropzone.getFiles()
        const output = []

        for(const file of files) {
            logger.log(`------------`)
            logger.log(`Start processing "${file.name}":`)
            try {
                logger.log(`parsing...`)
                const { data: rows, meta, errors } = await csv.parse(file)

                logger.log('parse complete')

                logger.log('calculating...')
                const evaluatedRows = rows.map(row => ecomo.evaluateRow(row))
                logger.log('calculation complete')

                output.push({
                    name: file.name.replace(/\.([^.]+?)$/, '_processed.$1'),
                    content: Papa.unparse(evaluatedRows, { delimiter: meta.delimiter, newline: meta.linebreak })
                })
            } catch (err) {
                logger.error(err)
            }
        }

        if(output.length > 0) {
            csv.save(output)
        }

    }, false);
}) ();






