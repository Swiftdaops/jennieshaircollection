import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discount: {
      type: {
        type: String,
        enum: ["percentage", "fixed"],
      },
      value: Number,
      isActive: {
        type: Boolean,
        default: false,
      },
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subCategory: {
      type: String,
    },

    images: [
      {
        url: String,
        publicId: String,
      },
    ],

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    tags: [String],

    frequentlyBoughtTogether: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

productSchema.virtual("finalPrice").get(function () {
  if (!this.discount?.isActive) return this.price;

  if (this.discount.type === "percentage") {
    return this.price - (this.price * this.discount.value) / 100;
  }

  if (this.discount.type === "fixed") {
    return Math.max(this.price - this.discount.value, 0);
  }

  return this.price;
});

export default mongoose.model("Product", productSchema);
