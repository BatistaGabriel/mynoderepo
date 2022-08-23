const express = require('express');

const app = express();


app.get("/", (request, response) => {
    // return response.send("Hello World!");
    return response.json({message: "Hello World!"});
})

app.listen(8232); // this means => localhost:8232