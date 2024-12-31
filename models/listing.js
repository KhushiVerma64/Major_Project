const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
//const { listingSchema } = require("../schema");


const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },

    image: {
        url: String,
        filename: String,
    },

    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true,
          },
          coordinates: {
            type: [Number],
            required: true,
          },
    },
});

listingSchema.post("findOneAndDelete",async(listing) => {
 if(listing) {
    await Review.deleteMany({_id: { $in: listing.reviews} });
 }
});


// listingSchema.post("findOneAndDelete", async function (listing) {
//     if (listing) {
//         try {
//             await Review.deleteMany({ _id: { $in: listing.reviews } });
//             console.log("Associated reviews deleted successfully.");
//         } catch (err) {
//             console.error("Error deleting associated reviews:", err);
//         }
//     }
// });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;


