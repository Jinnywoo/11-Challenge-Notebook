const express = require('express');
const path  = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const notes = require('./db/db.json');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for feedback`);
  return res.json(notes);
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to submit notes`);
  const { title, text } = req.body;

  if (title && text) {
    
    const createNote = {
      title,
      text,
      note_id: uuid(),
    };

    notes.push(createNote);
    let createNotes = JSON.stringify(notes);
  
    fs.writeFile(`./db/db.json`, createNotes, err => {
        err ? console.error(err) : console.log('Note Created')
});

// app.delete('/api/notes/:id', (req, res) => {


// };
    const response = {
      status: 'success',
      body: createNote,
    };

    res.json(response);
  } else {
    res.json('Error in saving note');
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);