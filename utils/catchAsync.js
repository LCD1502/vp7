module.exports = function (fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};


/* Try {
    fn(reg,res ,next)
} catch (err) {
    next(err)
}