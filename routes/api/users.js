const express = require("express");
const router = express.Router();
const usersCtrl = require("../../controllers/users");

//Require this for file uploads

const multer = require('multer');
const upload = multer();




/*---------- Public Routes ----------*/

// Http request
// POST /api/users/signup
router.post("/signup",  upload.single('photo'),usersCtrl.signup);
router.post("/login", usersCtrl.login);

/*---------- Protected Routes ----------*/

module.exports = router;



/*---------- Protected Routes ----------*/



