class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query; //Mongoose query (e.g., Product.find())
    this.queryStr = queryStr; //request query parameters (req.query)
  }

  search() {
    // Check if keyword exists in query params
    // If yes, sanitize it to prevent regex injection attacks
    const validKeyword = this.queryStr.keyword
      ? this.queryStr.keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      : "";

    // Build search condition
    const keyword = validKeyword
      ? {
          name: {
            $regex: validKeyword,
            $options: "i", // makes search case-insensitive
          },
        }
      : {};

    // Apply search filter to the query
    this.query = this.query.find(keyword);

    // Return 'this' to allow method chaining
    return this;
  }

  filter() {
    // Create a shallow copy of query parameters (req.query)
    const queryCopy = { ...this.queryStr };

    // Define fields that should be excluded from filtering
    // because they are used for other functionalities
    // like search and pagination
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // Apply remaining fields as filters to the mongoose query
    this.query = this.query.find(queryCopy);

    // Return 'this' to allow method chaining
    return this;
  }

  pagination(resultPerPage) {
    // Ensure current page is always >= 1
    const currentPage = Math.max(1, Number(this.queryStr.page) || 1);

    // Calculate number of documents to skip
    const skip = (currentPage - 1) * resultPerPage;

    // Apply pagination to query
    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

export default ApiFeatures;

/*
Q. Why use this class?”

Ans: It helps in separating query logic (search, filter, pagination)
from controllers, making the code modular, reusable, and scalable.


Q. How pagination works in MongoDB?

Ans: Pagination is implemented using skip and limit. Skip ignores a
certain number of documents based on the current page,
and limit restricts the number of documents returned per request.
*/
