const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { check, validationResult } = require('express-validator');

router.post(
  '/signup',
  [
    check('firstName', 'Please Enter a Valid First Name').not().isEmpty(),
    check('lastName', 'Please Enter a Valid Last Name').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password must be atleast 6 characters long!').isLength({
      min: 6,
    }),
    check('companyName', 'Please Enter a Valid Company Name').not().isEmpty(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  userController.registerUser
);

router.post(
  '/login',
  [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a valid password').isLength({
      min: 6,
    }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  userController.loginUser
);
router.post(
  '/googleSignin',
  [
    check('code')
      .not()
      .isEmpty()
      .withMessage('Google Sign-In code is required.'),
  ],
  userController.googleSignin
);

router.get('/logout', userController.logoutUser);

module.exports = router;
