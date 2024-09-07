const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

function toPigLatin(phrase) {
  return phrase.split(' ').map(word => {
    const firstLetter = word[0].toLowerCase();
    if ('aeiou'.includes(firstLetter)) {
      return word + 'way';
    } else {
      return word.slice(1) + firstLetter + 'ay';
    }
  }).join(' ');
}

app.post('/translate', (req, res) => {
  const { phrase } = req.body;
  const translated = toPigLatin(phrase);
  res.json({ translated });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});