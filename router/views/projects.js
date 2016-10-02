/**
 * Created by vaik on 8/6/16.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('projects', {layout: false});
});

module.exports = router;
