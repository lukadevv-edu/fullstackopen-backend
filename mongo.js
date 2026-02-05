const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

if (process.argv.length < 4) {
  const url = `mongodb+srv://luka:${password}@cluster0.b0aogbi.mongodb.net/phonebook?appName=Cluster0`;

  mongoose.set("strictQuery", false);

  mongoose.connect(url);

  Person.find({})
    .then((result) => {
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
    })
    .finally(() => {
      mongoose.connection.close();
    });

  return;
}

if (process.argv.length < 5) {
  console.log("give phonenumber as argument");
  process.exit(3);
}

const name = process.argv[3];
const phonenumber = process.argv[4];

const url = `mongodb+srv://luka:${password}@cluster0.b0aogbi.mongodb.net/phonebook?appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const person = new Person({
  name,
  number: phonenumber,
});

person
  .save()
  .then(() => {
    console.log(`added ${name} number ${phonenumber} to phonebook`);
  })
  .finally(() => {
    mongoose.connection.close();
  });
