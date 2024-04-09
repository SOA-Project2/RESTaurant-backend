const statusCodes = require("../constants/statusCodes");
const helpers = require("../helpers/ResponseHelpers")

const server = "https://us-central1-soa-g6-p2.cloudfunctions.net/recommendation/custom/"


async function fetchData(url, next) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const err = new Error("Error while requesting our service");
      err.status = response.status;
      throw err;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    if (next) {
      next(error);
    }
    throw error;
  }
}

/**
 * Handle external recommendation request
 * @param {*} req
 * @param {*} res
 * @returns
 */

const getRecommendation = (req, res, next) => {
    const query = req.query;
    let responseApi = {};
  
    const queryLength = Object.keys(query).length;
    const firstParameter = Object.keys(query)[0];
    const firstParameterValue = Object.values(query)[0];
    if (firstParameterValue.length === 0){
      return notFoundError(next)
    }
    let body = `?${firstParameter}=${firstParameterValue}`;
  
    if (queryLength === 2) {
      const secondParameter = Object.keys(query)[1];
      const secondParameterValue = Object.values(query)[1];
      if (secondParameterValue.length === 0){
        return notFoundError(next)
      }
      body += `&${secondParameter}=${secondParameterValue}`;
    }
  
    const apiUrl = server + body;
    console.log(apiUrl);
  
    fetchData(apiUrl)
      .then(jsonResponse => {
        console.log(jsonResponse);

        var meal = jsonResponse.meal;
        var dessert = jsonResponse.dessert;
        var drink = jsonResponse.drink;

        console.log("Meal: " + meal);
        console.log("Dessert: " + dessert); 
        console.log("Drink: " + drink);

        responseApi = helpers.writeResponse(
        responseApi,
        "meal",
        "drink",
        "dessert",
        meal,
        drink,
        dessert
        );
  
        res.status(statusCodes.OK).json(responseApi);
      })
      .catch(error => {
        if (error.status == 404) {
          return notFoundError(next)
        } else if (error.status == 400) {
          return badRequestError(next)
        } else {
          return internalServiceError(next)
        }
      });
  };
  
  function notFoundError(next) {
    const err = new Error("Could not find a recommendation for that meal");
    err.status = statusCodes.NOT_FOUND;
    return next(err);
  };

  function internalServiceError(next) {
    const err = new Error("Internal Server Error");
    err.status = statusCodes.INTERNAL_SERVER_ERROR;
    return next(err);
  };

  function badRequestError(next) {
    const err = new Error("Bad Request response. Invalid number of query parameters. Must be between 1 and 2. Or invalid query values, must be one of/: meal, drink, dessert.");
    err.status = statusCodes.BAD_REQUEST;
    return next(err);
  }

  module.exports = {
    getRecommendation,
  };