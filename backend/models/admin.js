const mongoose = require("mongoose");
const { Schema } = mongoose;

// Accounts that can sign in to the admin panel. Students don't need accounts.
const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: { type: String, required: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

// Never send the password hash to clients.
adminSchema.methods.toPublic = function () {
  return { _id: this._id, name: this.name, email: this.email };
};

module.exports = mongoose.model("Admin", adminSchema);
