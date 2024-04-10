const statusCodes = require("../constants/statusCodes");
const helpers = require("../helpers/ResponseHelpers")

const server = "https://us-central1-soa-g6-p2.cloudfunctions.net/schedule-recommendation/schedule/"


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

const getHourSuggestion = (req, res, next) => {
    const query = req.query;
    let responseApi = {};

    const weekday = Object.values(query)[0];
    if (weekday.length === 0){
      return notFoundError(next)
    }

    const reservationHour = Object.values(query)[1];
    if (reservationHour.length === 0){
    return notFoundError(next)
    }
    let body = `${weekday}/${reservationHour}`;
    
    const apiUrl = server + body;
    console.log(apiUrl);
  
    fetchData(apiUrl)
      .then(jsonResponse => {
        console.log(jsonResponse);

        var time = jsonResponse.time;
        var day = jsonResponse.day;
        var message = jsonResponse.message;

        console.log("Time: " + time);
        console.log("Day: " + day); 
        console.log("Message: " + message);

        responseApi = helpers.writeResponse(
        responseApi,
        "day",
        "time",
        "message",
        day,
        time,
        message
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
    const err = new Error("Pending message");
    err.status = statusCodes.NOT_FOUND;
    return next(err);
  };

  function internalServiceError(next) {
    const err = new Error("Internal Server Error");
    err.status = statusCodes.INTERNAL_SERVER_ERROR;
    return next(err);
  };

  function badRequestError(next) {
    const err = new Error("Bad Request response. Invalid number day of the week. [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday or Sunday]. Or invalid hour of the day, 24 hour format");
    err.status = statusCodes.BAD_REQUEST;
    return next(err);
  }

  module.exports = {
    getHourSuggestion,
  };