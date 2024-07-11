const bodyValidator = (schema, fileUploadField = null) => {
    return async (req, res, next) => {
        try {
           
            const data = req.body 

            if(fileUploadField){
                fileUploadField.map((uploadField) => {
                    if(req.file && req.file.fieldname === uploadField){
                        data[uploadField] = req.file.filename;
                    }
                })
            }

            if(req.files && fileUploadField){
                fileUploadField.forEach((uploadField) => {
                    if (req.files && req.files[uploadField]) {
                        data[uploadField] = req.files[uploadField][0].filename;
                    }
                });
            }

            await schema.validateAsync(data, { abortEarly: false })

            next()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    bodyValidator
}