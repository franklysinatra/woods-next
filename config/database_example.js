if(process.env.NODE_ENV === 'production'){
    //production database
    module.exports = {mongoURI: 'mongodb://<username>:<password>@ds117858.mlab.com:17858/woodnext-prod' }
} else {
    //testing database
    module.exports = {mongoURI: 'mongodb://127.0.0.1/<database name>'}
}