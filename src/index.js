const express = require('express');

const app = express();

app.use(express.json());

app.get("/", (request, response) => {
    // return response.send("Hello World!");
    return response.json({message: "Hello World!"});
})

/**
 * ?param1=123&param2=abc -> this means that this is a query param
 * 
 * they are commonly used on pagination and filters
 * remember: they are optional parameters
 */
app.get("/courses", (request, response)=>{
    const query = request.query;
    console.debug(query);
    
    return response.json(["Curso 1", "Curso 2", "Curso 3"]);
})

/**
 * in the request body:
 * 
 * {"name": "Jhon Doe", "age": 404 } 
 * 
 * ^^ this means that this is a body param
 * 
 * they are the objects that will be used in insertions/updates
 * remember: they are most of the time JSON
 */
app.post("/courses", (request, response)=>{
    const body = request.body;
    console.debug(body);

    return response.json(["Curso 1", "Curso 2", "Curso 3", "Curso 4"]);
})

/**
 * :id -> this means that this is a route param
 * 
 * they are commonly used to edit/delete/search something
 * remember: they are required parameters
 */
app.put("/courses/:id", (request, response)=>{
    const {id} = request.params;
    console.debug(id);

    return response.json(["Curso 6", "Curso 2", "Curso 3", "Curso 4"]);
})

app.patch("/courses/:id", (request, response)=>{
    return response.json(["Curso 6", "Curso 7", "Curso 3", "Curso 4"]);
})

app.delete("/courses/:id", (requenst, response)=>{
    return response.json(["Curso 1", "Curso 2", "Curso 4"]);
})

app.listen(8232); // this means => localhost:8232