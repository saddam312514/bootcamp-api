const express = require('express')


const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    bootcampPhotoUpload
} = require('../controllers/bootcamps')
const {protect,authorize} = require('../middleware/auth')
const Bootcamp = require('../models/Bootcamp');

// Include other resource routers
const courseRouter = require('./courses')
const reviewsRouter = require('./reviews')

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');

// Re-route into other resource routes
router.use('/:bootcampId/courses',courseRouter)
router.use('/:bootcampId/reviews',reviewsRouter)


router
.route('/')
.get(advancedResults(Bootcamp, 'courses'), getBootcamps)
.post( protect, authorize('publisher', 'admin'), createBootcamp);
 
router
  .route('/:id/photo')
  .put( protect, authorize('publisher', 'admin'), bootcampPhotoUpload);


router
.route('/:id')
.get(getBootcamp)
.put(protect,authorize('publisher', 'admin'), updateBootcamp)
.delete(protect,authorize('publisher', 'admin'), deleteBootcamp)



module.exports = router