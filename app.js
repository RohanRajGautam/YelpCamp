const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

//campground array
let campgrounds = [
  { name: 'Simon Creek', image: 'https://image.shutterstock.com/image-photo/camping-woods-shenandoah-mountain-bonfire-260nw-1106316416.jpg' },
  { name: 'Tom Hank', image: 'https://media.gettyimages.com/photos/camping-in-a-tent-under-the-stars-and-milky-way-galaxy-picture-id904960682?s=2048x2048' },
  { name: 'Robert Niro', image: 'https://media.gettyimages.com/photos/young-people-camping-with-a-baby-girl-picture-id627343204?s=2048x2048' },
]

app.get('/', (req, res) => res.render('landing'));

app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', { campgrounds: campgrounds });
})

app.post('/campgrounds', (req, res) => {

  //get data from form and add to campground array
  let name = req.body.name;
  let image = req.body.image;
  let newCampground = { name: name, image: image }
  campgrounds.push(newCampground);

  //redirect to campground page
  res.redirect('/campgrounds')
})

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
})

app.listen(port, () => console.log(`server listening at https://localhost:${port}`))