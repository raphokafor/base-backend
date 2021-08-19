const mongoose = require("mongoose");
const { Schema } = mongoose;

const locationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    archieved: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      maxlength: 80,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: 255,
      lowercase: true,
    },
    city: {
      type: String,
      maxlength: 80,
      lowercase: true,
    },
    state: {
      type: String,
      maxlength: 60,
      lowercase: true,
    },
    phoneNumber: {
      type: Number,
    },
    address: {
      type: String,
      required: [true, "Location requires an Address"],
      trim: true,
    },
    place_id: {
      type: String,
      required: [true, "Location requires a place_id"],
      trim: true,
    },
    location_point: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

locationSchema.index({ location_point: "2dsphere" });

module.exports = mongoose.model("locations", locationSchema);
