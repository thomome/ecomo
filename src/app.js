(() => {
		const input = document.querySelector('#input')
		const output = document.querySelector('#output')
		const analyze = document.querySelector('#analyze')

		const logger = new Logger(output)
		const csv = new CSV()
		const ecomo = new EcomoEvaluator();
		const dropzone = new Dropzone(input)

		logger.log(`ecomo v1.1.0`)    
		
		analyze.addEventListener('click', async () => {
				const files = dropzone.getFiles()
				const output = []

				for(const file of files) {
						logger.log(`------------`)
						logger.log(`Start processing "${file.name}":`)
						try {
								logger.log(`→ checking columns...`)
								const ok = await csv.check(file, EcomoEvaluator.requiredColumns)

								logger.log(`→ parsing...`)
								const { data: rows, meta } = await csv.parse(file)

								logger.log('→ parse complete')

								logger.log('→ calculating...')
								const evaluatedRows = rows.map(row => ecomo.evaluateRow(row))
								logger.log('→ calculation complete')

								output.push({
										name: file.name.replace(/\.([^.]+?)$/, '_processed.$1'),
										content: Papa.unparse(evaluatedRows, { delimiter: meta.delimiter, newline: meta.linebreak })
								})
						} catch (err) {
								logger.error(err)
						}
				}

				if(output.length > 0) {
					logger.log(`------------`)
					logger.log('Processing complete')
					logger.log('→ saving...')
					csv.save(output)
				}

		}, false);
}) ();






