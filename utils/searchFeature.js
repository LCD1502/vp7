exports.search = function (queryObj) {
   console.log(queryObj);   
    switch (queryObj.type) {
        case 'car':
            return 'car';
        case 'accessory':
            return 'accessory';
        case 'post':
            return 'post'
        default:
            return next(new AppError('No result found for this type', 404));
    }
}