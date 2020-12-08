class CSV {
    constructor() {}

    async parse(file) {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                dynamicTyping: true,
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if(
                        results.errors.length === 1 && 
                        results.errors[0].code === 'TooFewFields' &&
                        results.errors[0].row === (results.data.length - 1)
                    ) {
                        results.data.splice(-1, 1)
                        results.errors = []
                    }

                    if(results.errors.length === 0) {
                        resolve(results)
                    } else {
                        reject(results.errors[0])
                    } 
                },
                error: (error) => {
                    reject(error)
                }
            })
        }) 
    }

    async save(output) {
        return new Promise(async (resolve, reject) => {
            if(output.length === 1) {
                const file = output[0]
                const blob = new Blob([file.content], {type: "text/csv;charset=utf-8"})
                saveAs(blob, file.name)
            } else {
                const zip = new JSZip()

                for(const file of output) {
                    const blob = new Blob([file.content], {type: "text/csv;charset=utf-8"})
                    zip.file(file.name, blob)
                }

                const zipBlob = await zip.generateAsync({type:"blob"})
                saveAs(zipBlob, 'ecomo_package.zip')
                resolve()
            }
        })
    }
}
