const logger = (req,res,next) => {
    console(
        `${req.method} ${req.protocol}://${req.get('host')} ${req.orginalUrl}`
    )
    next()
}

module.exports = logger