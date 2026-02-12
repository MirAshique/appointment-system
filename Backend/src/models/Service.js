import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    image: {
      type: String,
      default: "",
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    /* ================= NEW FIELDS ================= */

    isPopular: {
      type: Boolean,
      default: false,
    },

    pricingType: {
      type: String,
      enum: ["standard", "premium"],
      default: "standard",
    },

    premiumMultiplier: {
      type: Number,
      default: 1.2,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;
