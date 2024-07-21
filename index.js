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
    const id = request.params.id
    persons = persons.filter((person) => person.id !== id)

    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: "name of person missing"
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: "number of person missing"
        })
    } else if (persons.find((person) => person.name === body.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    const id = Math.floor(Math.random() * 100000)

    const person = {
        id: String(id),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
