const {
  nextISSTimesForMyLocation,
  // fetchMyIP,
  // fetchCoordsByIP,
  // fetchISSFlyOverTimes,
} = require("./iss");
// let IP = "";
// let coord = {};
// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }
//   IP = ip;
//   console.log("It worked! Returned IP:", ip);
// });

// fetchCoordsByIP(IP, (error, coordinates) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }
//   coord = coordinates;

//   console.log("It worked! Returned coordinates:", coordinates);

//   fetchISSFlyOverTimes(coord, (error, passes) => {
//     if (error) {
//       console.log("It didn't work!", error);
//       return;
//     }

//     console.log("It worked! Returned coordinates:", passes);
//   });
// });
nextISSTimesForMyLocation((error, passes) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  passes.map((pass) => {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    console.log(`Next pass at ${datetime} for ${pass.duration} seconds!`);
  });
});
