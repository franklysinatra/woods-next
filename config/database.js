if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://<ConnorCallahan>:<1LovemLab!!!>@ds117858.mlab.com:17858/woodnext-prod' }
} else {
    module.exports = {mongoURI: 'mongodb://localhost/woodsnext-dev'}
}