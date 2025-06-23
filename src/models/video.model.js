import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; // step 1st

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // cloudinary url
      required: true
    },
    thumbnail: {
      type: String, // cloudinary url
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // cloudinary url
      required: true
    },
    view: {
      type: String,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  {timestamps: true}
)
videoSchema.plugin(mongooseAggregatePaginate) // step 2nd before export model, here we use / include aggreate pipeline by the help of plugin
export const Video = mongoose.model("Video", videoSchema)


