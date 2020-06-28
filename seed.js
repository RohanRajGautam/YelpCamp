const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

const data = [
  {
    name: "Resurrection Bay",
    image: "https://source.unsplash.com/eDgUyGu93Yw",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam dolor ac porttitor auctor.",
  },
  {
    name: "Resurrection Bay 2",
    image: "https://source.unsplash.com/eDgUyGu93Yw",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam dolor ac porttitor auctor.",
  },
  {
    name: "Resurrection Bay 3",
    image: "https://source.unsplash.com/eDgUyGu93Yw",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam dolor ac porttitor auctor.",
  },
];

function seedDB() {
  //remove all campgrounds
  Campground.deleteMany({}, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("Campground removed...");
    //add campgrounds
    data.forEach((seed) => {
      Campground.create(seed, (err, campground) => {
        if (err) {
          console.log(err);
        } else {
          console.log("campground created");
          //create a comment
          Comment.create(
            {
              text: "this is a comment.",
              author: "john doe",
            },
            (err, comment) => {
              if (err) {
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log("comment created");
              }
            }
          );
        }
      });
    });
  });
}

module.exports = seedDB;
