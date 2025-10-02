import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  heroImage: {
    type: String,
    required: true,
  },
  workImage: {
    type: String,
    required: true,
  },
  heroTitle: {
    type: String,
    required: true,
  },
  heroDescription: {
    type: String,
    required: true,
  },
  aboutDescription: {
    type: String,
    required: true,
  },
  projectsCompleted: {
    type: Number,
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
});
