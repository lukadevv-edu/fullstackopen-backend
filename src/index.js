const express = require("express");
const morgan = require("morgan");
const app = express();

// Plugins

app.use(express.json());
morgan.token("body", (request) => JSON.stringify(request.body));
app.use(morgan(":method :url :status :body - :response-time ms"));

// Config

const PORT = process.env.PORT || 3001;

// Data

let phonenumbers = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// Routes

{
  app.get("/api/persons", (_request, response) => {
    response.json(phonenumbers);
  });

  app.get("/info", (_request, response) => {
    response.send(
      `
      <!DOCTYPE html>
      <html>
        <body>
        <p>Phonebook has info for ${phonenumbers.length} people</p>
        <p>${new Date().toISOString()}</p>
        </body>
        </html>
        `,
    );
  });

  app.get("/api/persons/:id", (request, response) => {
    const found = phonenumbers.find((each) => each.id == request.params.id);

    if (!found) {
      return response.status(404).end();
    }

    response.json(found);
  });

  app.delete("/api/persons/:id", (request, response) => {
    const foundIndex = phonenumbers.findIndex(
      (each) => each.id == request.params.id,
    );

    if (foundIndex === -1) {
      return response.status(404).end();
    }

    phonenumbers = phonenumbers.filter((_, i) => i !== foundIndex);

    response.status(204).end();
  });

  app.post("/api/persons", (request, response) => {
    const body = request.body;
    const object = {
      id: Math.round(Math.random() * 1000000),
      ...body,
    };

    if (!body) {
      return response.status(400).json({ error: "body doesn't exist" });
    }

    if (!body.name) {
      return response.status(400).json({ error: "name must be defined" });
    }

    if (!body.number) {
      return response.status(400).json({ error: "number must be defined" });
    }

    if (phonenumbers.some((each) => each.name === object.name)) {
      return response
        .status(400)
        .json({ error: "name is already registered!" });
    }

    phonenumbers = [...phonenumbers, object];

    response.json(object);
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
