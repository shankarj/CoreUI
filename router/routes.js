var viewsPath = './views/';

module.exports = function(app){
    app.use('/', require(viewsPath + 'index'));
}