const express = require('express')
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser

} = require('../controllers/user')

const User = require('../models/User')
const router = express.Router({mergeParams: true})

const advancedResults = require('../middleware/advancedResults')
const {protect,authorize} = require('../middleware/auth')
router.use(protect) 

router
.route('/')
.get(advancedResults(User), getUsers)
.post(createUser)

router
.route('/:id')
.get(getUser)
.put(updateUser)
.delete(deleteUser)

module.exports = router