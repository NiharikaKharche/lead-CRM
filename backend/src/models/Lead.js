const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [150, 'Company name cannot exceed 150 characters'],
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'],
      default: 'New',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: '',
    },
    source: {
      type: String,
      enum: ['Website', 'Referral', 'Cold Call', 'Social Media', 'Email', 'Other'],
      default: 'Other',
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
leadSchema.index({ name: 'text', email: 'text', company: 'text' });

// Instance method for sanitized output
leadSchema.methods.toJSON = function () {
  const lead = this.toObject();
  lead.id = lead._id;
  return lead;
};

module.exports = mongoose.model('Lead', leadSchema);
