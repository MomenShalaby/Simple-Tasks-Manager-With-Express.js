class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.queryString = queryString;
    this.mongooseQuery = mongooseQuery;
  }

  populate(...args) {
    args.forEach((arg) => {
      this.mongooseQuery = this.mongooseQuery.populate(arg);
    });
    return this;
  }

  filter(nonAuthorized) {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryStringObject = { ...this.queryString };
    const excludeQueries = [
      "page",
      "limit",
      "sort",
      "fields",
      "keyword",
      "deleted",
      // "is_shared",
    ];
    excludeQueries.forEach((query) => delete queryStringObject[query]);

    let queryString = JSON.stringify(queryStringObject);
    queryString = queryString.replace(
      /\b(gte|lte|gt|lt)\b/g,
      (match) => `$${match}`
    );

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryString));

    if (this.queryString.is_shared && nonAuthorized) {
      this.mongooseQuery = this.mongooseQuery.find({
        is_shared: "true",
      });
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortFields = this.queryString.sort.split(",").join(" ");

      this.mongooseQuery = this.mongooseQuery.sort(sortFields);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      const sortFields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(sortFields); // Apply sorting criteria
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  keyword() {
    if (this.queryString.keyword) {
      const query = {};

      query.$or = [
        { name: { $regex: this.queryString.keyword, $options: "i" } },
      ];
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  deleted() {
    this.mongooseQuery = this.mongooseQuery.find({ isDeleted: "false" });
    return this;
  }

  pagination(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    const numberOfPages = Math.ceil(countDocuments / limit);
    const pagination = {};

    pagination.numberOfPages = numberOfPages;
    pagination.currentPage = page;
    pagination.limit = limit;

    if (endIndex < countDocuments) {
      pagination.nextPage = page + 1;
    }
    if (skip > 0) {
      pagination.previousPage = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.pagination = pagination;
    return this;
  }
}
module.exports = ApiFeatures;
