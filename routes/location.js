const express = require("express");
const router = express.Router();

const locationController = require("../controllers/locationController");
const middleWares = require("../middlewares/middleWares");

router
  .route("/v1/locations/:distance/center/:latlng")
  .get(locationController.getLocationsWithin);

router
  .route("/v1/locations/distance/:latlng")
  .get(locationController.getDistances);

// requires either vendor or super user
router
  .route("/v1/locations")
  .post(
    middleWares.requireLogin,
    middleWares.restrictTo("vendor", "odogwu"),
    locationController.createLocation
  )
  .get(locationController.filterLocations);

router
  .route("/v1/locations/:id")
  .get(locationController.getLocation)
  .delete(
    middleWares.requireLogin,
    middleWares.restrictTo("vendor", "odogwu"),
    locationController.deleteLocation
  );

module.exports = router;
