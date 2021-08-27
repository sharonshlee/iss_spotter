/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require("request");

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request("https://api.ipify.org?format=json", (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    //if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(msg, null);
      return;
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

//takes in an IP address and returns the latitude and longitude for it.
const fetchCoordsByIP = function(ip, callback) {
  const geoURL = "https://freegeoip.app/json/";

  request(`${geoURL}${ip}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    //if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching latitude and longitude. Response: ${body}`;
      callback(msg, null);
      return;
    }

    const { latitude, longitude } = JSON.parse(body);

    callback(null, { latitude, longitude });
  });

  /**
   * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
   * Input:
   *   - An object with keys `latitude` and `longitude`
   *   - A callback (to pass back an error or the array of resulting data)
   * Returns (via Callback):
   *   - An error, if any (nullable)
   *   - The fly over times as an array of objects (null if error). Example:
   *     [ { risetime: 134564234, duration: 600 }, ... ]
   */
};
const fetchISSFlyOverTimes = function(coords, callback) {
  // console.log(coords);
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  // console.log(url);
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(
        Error(
          `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`
        ),
        null
      );
      return;
    }

    const passes = JSON.parse(body).response;
    console.log(passes);
    callback(null, passes);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error);
      return;
    }

    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        callback(error);
        return;
      }

      fetchISSFlyOverTimes(coordinates, (error, passes) => {
        if (error) {
          callback(error);
          return;
        }
        callback(null, passes);
      });
    });
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation,
};

/*
Output:
It worked! Returned coordinates: { latitude: 49.6653, longitude: -50.4343 }
It worked! Returned IP: 22.140.168.226

It didn't work! Error: getaddrinfo ENOTFOUND apiipify.org
    at GetAddrInfoReqWrap.onlookup [as oncomplete] (node:dns:69:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'apiipify.org'
}

It didn't work! Status Code 404 when fetching latitude and longitude. Response: 404 page not found
*/
