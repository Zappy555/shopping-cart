const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.send('Admin area');
});

//exporting router
module.exports = router;