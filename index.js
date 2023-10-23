const express = require('express');
const app = express();
const path = require('path');
const router = require('./router'); // Change to router (not destructuring)
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname,'public')))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', router); // Use the 'router' variable here

app.listen(3001, () => {
  console.log('Server started on http://localhost:3001/  + 4444');
});
     
