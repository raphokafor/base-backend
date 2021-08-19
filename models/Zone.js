const mongoose = require("mongoose");
const { Schema } = mongoose;

const zoneSchema = new Schema(
  {
    locationId: { type: Schema.Types.ObjectId, ref: "Location" },
    archieved: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      maxlength: 255,
      lowercase: true,
    },
    zoneNumber: {
      type: Number,
      required: [true, "Zone requires zonenumber"],
    },
    price: {
      type: Number,
      validate: {
        validator: function (val) {
          return val > 0;
        },
        message: "Price ({VALUE}) must be greater than 0",
      },
    },
    isHourly: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

// mongoose document, runs before the save/create methods
zoneSchema.pre("save", function (next) {
  console.log(this);
  next();
});

module.exports = mongoose.model("zones", zoneSchema);
