require("dotenv").config()
const express = require("express")
const app = express();
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")

app.use(cors())
app.use(express.json())
app.use(express.static("dist"))


app.use(
    morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
        JSON.stringify(req.body),
    ].join(" ")
    })
);

app.get("/api/persons", (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons)
    })
})

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then((person) => {
        response.json(person)
    })
})

app.get("/info", (request, response) => {
    Person.find({}).then((persons) => {
        const date = new Date()
        response.send(
            `<p>Phonebook has info for ${persons.length} people</p>
            <p>${date}</p>`
        )
    })
})

app.delete("/api/persons/:id", (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post("/api/persons", (request, response) => {
    const body = request.body

    const name = body.name
    const number = body.number

    if (!name) {
        return response.status(400).json({
            error: "name of person missing"
        })
    } else if (!number) {
        return response.status(400).json({
            error: "number of person missing"
        })
    }

    const person = new Person({
        name,
        number,
    });

    person.save().then((savedPerson) => {
        response.json(savedPerson)
    })

})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
