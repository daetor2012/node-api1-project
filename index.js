const express = require("express")
const server = express()
server.use(express.json())
let database = require("./data/db")

server.get("/", (req, res) => {
    res.json({ message: "Server is running successfully." })
  })
  
  server.post("/api/users", (req, res) => {
      const newUser = {
        name: req.body.name,
        bio: req.body.bio
        
      }
      if(newUser.hasOwnProperty("bio") && newUser.hasOwnProperty("name")) {
        database.insert(newUser)
            .then(response => {
                res.status(201).json({ message: "User successfully added!", newUser })
            })
            .catch(error => {
                res.status(500).json({ errorMessage: "There was an error while saving the user to the database", error })
            })
      } else res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
  })

server.get("/api/users", (req, res) => {
    database.find()
        .then(response => {
            res.status(200).json(response)
        })
        .catch(error => {
            res.status(500).json({ errorMessage: "The users information could not be retrieved.", error })
        })
    res.status()
})

server.get("/api/users/:id", (req, res) => {
    const id = req.params.id
    database.findById(id)
        .then(response => {
            res.status(200).json(response)
        })
        .catch(error => {
            res.status(404).json({ message: "The user with the specified ID does not exist.", error })
        })
})

server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id
    database.remove(id)
        .then(response => {
            if(response == 1) {
                res.status(200).json({ message: `The user was successfully deleted from the database!`})
            } else res.status(404).json({ message: "The user with the specified ID does not exist." })
            
        })
        .catch(error => {
            res.status(500).json({ errorMessage: "The user could not be removed", error })
        })
})

server.put("/api/users/:id", (req, res) => {
    const id = req.params.id
    const newUser = {
        bio: req.body.bio,
        name: req.body.name 
    }
    if(newUser.name && newUser.bio) {
        database.update(id, newUser)
        .then(response => {
            if(response == 1) {
                res.status(200).json({ message: "User successfully modified!" })
            } else res.status(404).json({ message: "The user with the specified ID does not exist." })
           
        })
        .catch(error => {
            res.status(500).json({ errorMessage: "The user information could not be modified.", error })
        })
    } else res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    
})

  server.listen(8080, () => {
    console.log("server started at http://localhost:8080")
})