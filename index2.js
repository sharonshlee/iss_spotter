const {
  nextISSTimesForMyLocation
} = require("./iss_promised");

nextISSTimesForMyLocation()
  .then((passes) => {
    passes.map((pass) => {
      const datetime = new Date(0);
      datetime.setUTCSeconds(pass.risetime);
      console.log(`Next pass at ${datetime} for ${pass.duration} seconds!`);
    });
  }).catch(error => console.log('Not working', error));