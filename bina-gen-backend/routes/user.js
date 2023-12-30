const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const guard = require('../middleware/authMiddleware');

router.post('/:role', guard.isAuthorized(), userController.createUser);
router.get('/:username', guard.isAuthorized(), userController.getUser);
// router.put('/user/:username', userController.updateUser);
// router.delete('/user/:username', userController.deleteUser);

module.exports = router;