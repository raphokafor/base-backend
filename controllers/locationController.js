const Location = require("../models/Location");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const handleAsync = require("../utils/handleAsync");

// to create documents(objects) in model instead of creating the object first then save you can just create on the model
// old:
// const user = new User({})
// await user.save();

// new:
// await User.create({})

exports.createLocation = handleAsync(async (req, res, next) => {
  const location = await Location.create(req.body);

  res.status(200).json({
    status: "success",
    data: location,
  });
});

exports.getLocations = handleAsync(async (req, res, next) => {
  const locations = await Location.find();

  res.status(200).json({
    status: "success",
    results: locations.length,
    data: {
      locations,
    },
  });
});

exports.getLocation = handleAsync(async (req, res, next) => {
  const location = await Location.findById(req.params.id);

  if (!location) {
    return next(new AppError("This location does not exist", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      location,
    },
  });
});

exports.filterLocations = handleAsync(async (req, res, next) => {
  const features = new APIFeatures(Location.find(), req.query)
    .filter()
    .sort()
    .field()
    .paginate();

  // execute query
  const locations = await features.query;

  // send request
  res.status(200).json({
    status: "success",
    results: locations.length,
    data: {
      locations,
    },
  });
});

exports.getLocationStats = handleAsync((req, res, next) => {
  const stats = Location.aggregate([
    // will add code here later, most likely should be for parkinglot
  ]);
  res.status(400).json({
    status: "success",
    data: "data here",
  });
});

exports.deleteLocation = handleAsync(async (req, res, next) => {
  const location = await Location.findByIdAndDelete(req.params.id);

  if (!location) {
    return next(new AppError("This location does not exist", 404));
  }

  res.status(200).json({
    status: "success",
    results: locations.length,
    data: {
      location,
    },
  });
});

exports.getLocationsWithin = handleAsync(async (req, res, next) => {
  const { distance, latlng } = req.params;

  // split latlng
  const [lat, lng] = latlng.split(",");

  // convert distance to radius understandable by mongo
  const radius = distance / 3963.2;

  if (!lat || !lng) {
    return next(
      new AppError(
        "Please provide latitute and longitude in the correct format lat,lng.",
        400
      )
    );
  }

  const locations = await Location.find({
    location_point: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: "success",
    results: locations.length,
    data: {
      data: locations,
    },
  });
});

exports.getDistances = handleAsync(async (req, res, next) => {
  const { latlng } = req.params;

  // split latlng
  const [lat, lng] = latlng.split(",");

  if (!lat || !lng) {
    return next(
      new AppError(
        "Please provide latitute and longitude in the correct format lat,lng.",
        400
      )
    );
  }

  const distances = await Location.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: 0.000621371192,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
        address: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      data: distances,
    },
  });
});
