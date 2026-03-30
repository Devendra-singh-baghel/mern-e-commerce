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
}

export default ApiFeatures;

/*
Q. Why use this class?”

Ans: It helps in separating query logic (search, filter, pagination)
from controllers, making the code modular, reusable, and scalable.
*/
