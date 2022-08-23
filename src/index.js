const express = require('express');

const app = express();


app.get("/", (request, response) => {
    // return response.send("Hello World!");
    return response.json({message: "Hello World!"});
})

app.get("/courses", (request, response)=>{
    return response.json(["Curso 1", "Curso 2", "Curso 3"])
})

app.post("/courses", (request, response)=>{
    return response.json(["Curso 1", "Curso 2", "Curso 3", "Curso 4"])
})

app.put("/courses/:id", (request, response)=>{
    return response.json(["Curso 6", "Curso 2", "Curso 3", "Curso 4"])
})

app.patch("/courses/:id", (request, response)=>{
    return response.json(["Curso 6", "Curso 7", "Curso 3", "Curso 4"])
})

app.delete("/courses/:id", (requenst, response)=>{
    return response.json(["Curso 1", "Curso 2", "Curso 4"])
})

app.listen(8232); // this means => localhost:8232