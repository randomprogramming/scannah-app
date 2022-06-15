import mongoose from "mongoose";

// Since every API route is atomic,
// we can’t tell if this function has
// been called already. This means that
// we need to check for the database status
// in each route rather than centrally. So, our utility
// needs to be imported and used on every route.
export default async () => {
  // Here is where we check if there is an active connection.
  if (mongoose.connections[0].readyState) return;

  try {
    // Here is where we create a new connection.
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log("DB error", error);
  }
};
