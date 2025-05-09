const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Node.js Simple CRUD with Express.js and MySQL Tutorial'
  });
});

module.exports = router;
