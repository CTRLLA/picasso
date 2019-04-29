const path = require('path');
const express = require('express');
const text2png = require('text2png');
const sharp = require('sharp');
const textToPicture = require('text-to-picture');

const app = express();
const { NODE_ENV = 'development', PORT = '3000' } = process.env;

app.get('/', async (req, res) => {
  const {
    text = 'Hello, Piccaso',
    width = 1200,
    height = 628
  } = req.query;
  const image = await textToPicture.convert({
    text,
    source: {
      width,
      height,
      background: 0x333333
    },
    color: 'white',
    ext: 'png',
    // quality: 100,
    // customFont: path.resolve(__dirname + '/fonts/Helvetica.fnt'),
    // customFont: path.resolve(__dirname + '/fonts/font.fnt')
  });
  const imageBuffer = await image.getBuffer();
  res.set('Content-Type', 'image/png');
  res.end(imageBuffer);
});

app.get('/v2', (req, res) => {
  const { text = 'Hello\nWorld' } = req.query;
  const image = text2png(text, {
    font: '80px Futura',
    color: '#ffffff',
    textAlign: 'center',
    backgroundColor: '#333333',
    padding: 50
  });
  res.set('Content-Type', 'image/png');
  res.end(image);
});

app.get('/v3', async (req, res) => {
  const { text = 'Hello World', size = '100' } = req.query;

  const backgroundImage = await sharp({
    create: {
      width: 1200,
      height: 600,
      channels: 4,
      background: { r: 51, g: 51, b: 51, alpha: 1.0 }
    }
  }).png()
    .toBuffer();

  const textImage = text2png(text, {
    font: `${size}px Futura`,
    localFontPath: path.resolve(__dirname + '/fonts/futura/Futura Bold Italic font.ttf'),
    localFontName: 'Futura',
    color: '#ffffff',
    textAlign: 'center',
    backgroundColor: '#333333',
    lineSpacing: 40,
    padding: 50
  });

  const finalImage = await sharp(backgroundImage)
    .composite([{ input: textImage, gravity: 'centre' }])
    .sharpen()
    .withMetadata()
    .webp( { quality: 90 } )
    .toBuffer();

  res.set('Content-Type', 'image/png');
  res.end(finalImage);
});

app.listen(PORT, () => console.log(`Piccaso server listening on port ${PORT}`));
