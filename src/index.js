const express = require("express");
const {v4: uuidV4} = require ("uuid");

const app = express();
const customers = [];

app.use(express.json())

/**
 * CPF - String             -> Received by client post
 * Name - String            -> Received by client post
 * ID - uuid                -> Generated by the application
 * Statement - array[]      -> Generated by the application
 */
app.post("/account", (request, response)=>{
    const {cpf, name} = request.body;
    const id = uuidV4();

    customers.push({
        cpf,
        name,
        id,
        statement: []
    });

    console.debug(customers);

    return response.status(201).end();
})

app.listen(8332);