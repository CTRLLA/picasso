const path = require('path');
const express = require('express');
const text2png = require('text2png');
const sharp = require('sharp');

const app = express();
const { NODE_ENV = 'development', PORT = '3000' } = process.env;

app.get('/', async (req, res) => {
  const { text = 'Hello World', size = '100' } = req.query;

  const backgroundImagePath = path.resolve(__dirname + '/img/starry-night.png');
  const backgroundImage = await sharp(backgroundImagePath)
    .toBuffer();

  const textImage = text2png(text, {
    font: `${size}px Futura`,
    localFontPath: path.resolve(__dirname + '/fonts/futura/Futura Bold Italic font.ttf'),
    localFontName: 'Futura',
    color: '#ffffff',
    textAlign: 'center',
    // backgroundColor: '#333333',
    lineSpacing: 40,
    padding: 50
  });

  const finalImage = await sharp(backgroundImage)
    .composite([{ input: textImage, gravity: 'centre' }])
    .sharpen()
    .withMetadata()
    .png({ quality: 90 })
    .toBuffer();

  res.set('Content-Type', 'image/png');
  res.end(finalImage);
});

app.get('/v3', (req, res) => {
  const path = req._parsedUrl.query ? `?${req._parsedUrl.query}` : '';
  res.redirect(301, `/${path}`);
});

app.listen(PORT, () => console.log(`Piccaso server listening on port ${PORT}`));
