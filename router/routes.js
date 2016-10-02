var viewsPath = './views/';
		
module.exports = function (app) {
    app.use('/', require(viewsPath + 'index'));
    app.use('/login', require(viewsPath + 'login'));
    app.use('/projects',require(viewsPath + 'projects'))
}
