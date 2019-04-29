const express = require('express');

const app = express();
const { NODE_ENV = 'development', PORT = '3000' } = process.env;

app.get('/', (req, res) => res.send('Hello, World!'));
app.listen(PORT, () => console.log(`Piccaso server listening on port ${PORT}`));
