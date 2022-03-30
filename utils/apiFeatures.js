class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // 1a) filtering
        const queryObj = { ...this.queryString };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((field) => {
            delete queryObj[field];
        });
        console.log('req.query: ', this.queryString);
        console.log('query Obj: ', queryObj);

        // 1b) advance filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        console.log('filtering Obj', JSON.parse(queryStr));

        //let query = Tour.find(JSON.parse(queryStr)); // find method return a query object
        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        // 2) sorting
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' '); // split to an array, join to create array with space
            console.log('Sorting Obj', sortBy);
            this.query = this.query.sort(sortBy); // IN API ...?sort=price / ...?sort=-price
            // sort(price ratingsAverage)
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        // 3) fields limiting
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            console.log('Select Fields:', fields);
            this.query = this.query.select(fields); // .select('name price difficulty duration')
        } else {
            this.query = this.query.select('-__v'); // except '__v' field
        }
        return this;
    }

    paginate() {
        // 4) Pagination
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;
        // ?page=1&limit=10, page1 1-10, page2 11-20, ...
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;
