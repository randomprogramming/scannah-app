import mongoose, { Document, Schema, model } from "mongoose";

export interface DownloadLinkBaseInterface {
  link: string;
  createdAt: Date;
}

export interface DownloadLinkInterface
  extends DownloadLinkBaseInterface,
    Document {}

const downloadLinkSchema = new Schema<DownloadLinkInterface>({
  link: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 13.5, // 13 days and 12 hours in seconds
  },
});

export default mongoose.models.DownloadLink ||
  model<DownloadLinkInterface>("DownloadLink", downloadLinkSchema);
