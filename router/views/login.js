/**
 * Created by vaik on 8/6/16.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function (req, res, next) {
    res.render('login', {layout: false});
});

module.exports = router;
