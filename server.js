const express = require('express');
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('build', 'index.html'), (err) => {
      if (err) return res.status(500).send(err)
    });
  });
}

app.listen(port, (err) => {
  if (err) return console.log(err);
  console.log(`Server running on ${port}`);
});