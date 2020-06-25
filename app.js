const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('landing'));

app.get('/campgrounds', (req, res) => {
  let campgrounds = [
    { name: 'Simon Creek', image: 'https://image.shutterstock.com/image-photo/camping-woods-shenandoah-mountain-bonfire-260nw-1106316416.jpg' },
    { name: 'Tom Hank', image: 'https://media.gettyimages.com/photos/camping-in-a-tent-under-the-stars-and-milky-way-galaxy-picture-id904960682?s=2048x2048' },
    { name: 'Robert Niro', image: 'https://media.gettyimages.com/photos/young-people-camping-with-a-baby-girl-picture-id627343204?s=2048x2048' },
  ]
  res.render('campgrounds', { campgrounds: campgrounds });
})

app.listen(port, () => console.log(`server listening at https://localhost:${port}`))