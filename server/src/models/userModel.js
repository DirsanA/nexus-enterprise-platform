import mongoose from "mongoose";

// Mongoose Schema defines the structure and rules for user documents in MongoDB
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    role: {
      type: String,
      enum: ["Admin", "User", "Manager"],
      default: "User",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

export const User = mongoose.model("User", userSchema);
