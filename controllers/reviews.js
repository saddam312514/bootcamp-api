const ErrorResponse = require('../utils/errorResponse')
const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/async')
const Review = require('../models/Review')
const { param } = require('../routes/auth')

exports.getReviews = asyncHandler(async(req,res,next)=>{
    if(req.params.bootcampId){
        const reviews = await Review.find({bootcamp: req.params.bootcampId})
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    }else {
        res.status(200).json(res.advancedResults)
    }

})

exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
      path: 'bootcamp',
      select: 'name description'
    });
  
    if (!review) {
      return next(
        new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
      );
    }
  
    res.status(200).json({
      success: true,
      data: review
    });
  });

  exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
  
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  
    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `No bootcamp with the id of ${req.params.bootcampId}`,
          404
        )
      );
    }
  
    const review = await Review.create(req.body);
  
    res.status(201).json({
      success: true,
      data: review
    });
  });


  exports.updateReview = asyncHandler(async (req, res, next) => {

  let review = await Review.findById(req.params.id)
  if(!review){
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`,404)
    )
  }
  // Make sure review belong to user or user is admin
  if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(
      new ErrorResponse(`No authorized to update reviw`, 401)
    )
  }
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

    res.status(201).json({
      success: true,
      data: review
    });
  });

  exports.deleteReview = asyncHandler(async (req, res, next) => {

    let review = await Review.findById(req.params.id)
    if(!review){
      return next(
        new ErrorResponse(`No review with the id of ${req.params.id}`,404)
      )
    }
    // Make sure review belong to user or user is admin
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
      return next(
        new ErrorResponse(`No authorized to Delete reviw`, 401)
      )
    }
   await review.remove()
  
      res.status(201).json({
        success: true,
        data: {}
      });
    });