if(process.env.NODE_ENV === 'production'){
    //production database with mLab. Link can be found in your mLab database dashboard
    module.exports = {mongoURI: 'mongodb://<username>:<password>@<mlab database destination>' }
} else {
    //testing database
    module.exports = {mongoURI: 'mongodb://127.0.0.1/<database name>'}
}