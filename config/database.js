if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://sinatra:test!!!testing!!!@ds117858.mlab.com:17858/woodnext-prod' }
} else {
    module.exports = {mongoURI: 'mongodb://127.0.0.1/woodsnext-dev'}
}