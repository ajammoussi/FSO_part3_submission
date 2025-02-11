const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide password as an argument like this: \n node mongo.js ')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://test:${password}@fso-part3-demo.t5pfu8c.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=FSO-part3-demo`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook: ')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {

  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number,
  })

  person.save()
    .then((result) => {
      console.log(`Added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
}

