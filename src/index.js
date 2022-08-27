const express = require("express");
const {v4: uuidV4} = require ("uuid");

const app = express();
const customers = [];

app.use(express.json())

/**
 * Obecjet Struct
 * 
 * CPF - String             -> Received by client post
 * Name - String            -> Received by client post
 * ID - uuid                -> Generated by the application
 * Statement - array[]      -> Generated by the application
 */

// Middlewares
function verifyIfExistsAccountByCPF(request, response, next){
    const {cpf} = request.headers;
    const customer = customers.find(customer => customer.cpf === cpf);

    if(!customer){
        return response.status(400).json({error: "Customer Not Found!"})
    }

    request.customer = customer;

    return next();
}

app.post("/account", (request, response)=>{
    const {cpf, name} = request.body;

    const customersAlreadyExists = customers.some(
        (customer)=> customer.cpf === cpf
    );

    if(customersAlreadyExists){
        return response.status(400).json({error: "Customer Already Exists!"});
    }

    customers.push({
        cpf,
        name,
        id: uuidV4(),
        statement: []
    });

    console.debug(customers);

    return response.status(201).end();
})

/**
 * app.use(verifyIfExistsAccountByCPF);
 * 
 * This line above means that all the routes bellow 
 * the line will use the expecified middleware, if I
 * want to use specific middlewares per route I should
 * use the sintax bellow
 */
app.get("/statement", verifyIfExistsAccountByCPF, (request, response)=>{
    const {customer} = request;

    console.debug(customer.statement);
    return response.json(customer.statement)
})

app.post("/deposit", verifyIfExistsAccountByCPF, (request, response)=>{
    const {description, amount} = request.body;
    const {customer} = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "Credit"
    };

    customer.statement.push(statementOperation);

    console.debug(customer.statement)

    return response.status(201).send();
})

app.listen(8332);