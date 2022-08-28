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

// Functions
function getAccountBalance(statement){
    const balance = statement.reduce((acc, operation)=>{
        if(operation.type === 'credit'){
            return acc + operation.amount;
        }
        else{
            return acc - operation.amount;
        }
    }, 0)


    return balance
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

    return response.json(customer.statement)
})

app.get("/statement/date", verifyIfExistsAccountByCPF, (request, response)=>{
    const {customer} = request;
    const {date} = request.query;
    const dateFormat = new Date(date + " 00:00");
    
    const statement = customer.statement.filter(
        (statement)=>
        statement.created_at.toDateString() === new Date(dateFormat).toDateString()
    );
    
    return response.json(statement);
});

app.post("/deposit", verifyIfExistsAccountByCPF, (request, response)=>{
    const {description, amount} = request.body;
    const {customer} = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    };

    customer.statement.push(statementOperation);


    return response.status(201).send();
})

app.post("/withdraw", verifyIfExistsAccountByCPF, (request, response)=>{
    const {amount} = request.body;
    const {customer} = request;
    const balance = getAccountBalance(customer.statement);
    
    if(balance < amount){
        return response.status(400).json({error: "Insulficient Funds!"})
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "debit"
    }

    customer.statement.push(statementOperation)

    return response.status(201).send()
})

app.listen(8332);