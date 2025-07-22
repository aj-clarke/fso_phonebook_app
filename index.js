const express = require('express');
const app = express();
const morgan = require('morgan');
// const cors = require('cors');

// app.use(cors());
app.use(express.static('dist'));

morgan.token('postReq', function getPostData(req) {
  return JSON.stringify(req.newPerson);
});

function assignPostData (req, res, next) {
  if (req.body) {
    req.newPerson = req.body;
  }
  next();
}

app.use(express.json());
app.use(assignPostData);
app.use(morgan(':method, :url :response-time :postReq'));

let persons = [
  { 
    id: "1",
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: "2",
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: "3",
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: "4",
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
];

// helper functions

const generateId = () => {
  return Math.floor(Math.random() * 20000);
}

const duplicateNameExists = (name) => {
  return persons.find(n => n.name === name);
}

// routes

app.get('/', (request, response) => {
  response.send('<h1>Hello World!<h1>');
});

app.get('/api/persons/', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(p => p.id === id);
  // const person = persons.filter(p => p.id === id)[0]; Another option

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});


app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body) {
    return response.status(400).json({
      error: 'missing data'
    });
  } else if (!body.name) {
    return response.status(400).json({
      error: 'missing name'
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: 'missing number'
    });
  } else if (duplicateNameExists(body.name)) {
    console.log('duplciate name already exists');
    return response.status(400).json({
      error: 'duplciate name already exists'
    });
  }
  
  const newPerson = {
    id: String(generateId()),
    name: body.name,
    number: body.number
  };

  persons = persons.concat(newPerson);

  response.json(newPerson);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(p => p.id === id);

  if (person) {
    persons = persons.filter(p => p.id !== id);
    response.status(204).end();
  } else {
    console.log('entry not found, handle error?');
    response.status(404).end();
  }
})

app.get('/info', (request, response) => {
  response.send(`
    <div>Phonebook has info for ${persons.length} people </div>
    <br />
    <div>${Date()}</div>
  `);
});

// server configuration
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});