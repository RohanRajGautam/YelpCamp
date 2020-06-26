const express = require('express');
app = express(),
  bodyParser = require('body-parser'),
  port = 3000,
  mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/yelp', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

//Schema set up
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
});

let Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create(
//   {
//     name: 'Tom Hank',
//     image: 'https://media.gettyimages.com/photos/camping-in-a-tent-under-the-stars-and-milky-way-galaxy-picture-id904960682?s=2048x2048',
//   }, (err, campground) => {
//     if (err) {
//       console.log("SOMETHING WENT WRONG!")
//     } else {
//       console.log("NEW DATABASE ADDED");
//       console.log(campground);
//     }
//   });


app.get('/', (req, res) => res.render('landing'));

app.get('/campgrounds', (req, res) => {
  // get all campground from database
  Campground.find({}, (err, allCamps) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds', { campgrounds: allCamps });
    }
  })
})

app.post('/campgrounds', (req, res) => {

  //get data from form and add to campground array
  let name = req.body.name;
  let image = req.body.image;
  let newCampground = { name: name, image: image }

  // create a new campground and add to database
  Campground.create(newCampground, (err, newCamp) => {
    if (err) {
      console.log("SOMEthing WENT WRONG!!")
    } else {
      //redirect to campground page
      res.redirect('/campgrounds')
    }
  })
})

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
})

app.listen(port, () => console.log(`server listening at https://localhost:${port}`))