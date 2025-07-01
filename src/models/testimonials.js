import mongoose from 'mongoose';

export const testimonialSchema = new mongoose.Schema({
  name: { type: String},
  review: { type: String},

}, { timestamps: true });

