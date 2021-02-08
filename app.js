const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()
const port = process.env.PORT || 3009

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

// MySQL 
const pool = mysql.createPool({
    host: '129.146.160.60',
    user: 'root',
    password: 'Mars1248',
    database: 'order_table',
    multipleStatements: true
});
 
// Get all orders
app.get('/orders', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        // console.log(`connected as id ${connection.threadId}`)
        connection.query(`SELECT * FROM order_table.orders ORDER BY order_Id desc;`, (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

        });
    });
});

// Get a orders by ID
app.get('/orders/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * FROM order_table.orders WHERE order_Id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

        })
    })
})
  

// insert a orders 
app.post('/orders', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        const params = req.body
        connection.query('INSERT INTO orders SET ?', params, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                console.log('The data from order table are: \n', rows.insertId)
                res.send({ orderid: rows.insertId })
            } else {
                console.log(err)
            }
           
        })
    })
})
   
// Update a roder //orders
app.put('/orders', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        // console.log(`connected as id ${connection.threadId}`)
        const { order_Id, FirstName, ContactNumber, Address, Email, Country, City, State, date, Status } = req.body
        connection.query('UPDATE orders SET FirstName = ?, ContactNumber = ?, Address = ?, Email = ?, Country = ?, City = ?, State = ?, date = ?, Status = ? WHERE order_Id = ?', [FirstName, ContactNumber, Address, Email, Country, City, State, date, Status, order_Id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`The order id: ${order_Id} has been updated.`)
            } else {
                console.log(err)
            }
        })
        console.log(req.body)
    })
})


// Delete a orders 
app.delete('/orders/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        // console.log(`connected as id ${connection.threadId}`)
        connection.query('DELETE FROM orders WHERE order_Id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`order with the Record ID: ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }

        })
    })
})

app.get('/product', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        // console.log(`connected as id ${connection.threadId}`)
        connection.query(`SELECT * FROM order_table.product ORDER BY product_id desc`, (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

app.get('/orderdetails', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        // console.log(`connected as id ${connection.threadId}`)
        connection.query(` SELECT * FROM order_table.orderdetails INNER JOIN
        order_table.product ON order_table.orderdetails.product_Id = order_table.product.product_Id 
        ORDER BY order_Details_Id desc`, (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

        });
    });
});

app.get('/orderdetails/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query(` SELECT * FROM order_table.orderdetails INNER JOIN
        order_table.product ON order_table.orderdetails.product_Id = order_table.product.product_Id 
        WHERE order_table.orderdetails.order_Id = ? `, [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

        })
    })
})

// insert a orderdetails 
app.post('/orderdetails', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        const DetailArray = req.body;
        let queryparam = [DetailArray.map(detail => [detail.order_Id, detail.product_Id, detail.quantity])];
        connection.query('INSERT INTO order_table.orderdetails (order_Id, product_Id, quantity) VALUES ?', queryparam, (err, rows) => {
            connection.release()
            if (!err) {
                res.send({order_Details_Id: rows})
                
                console.log('Hello the details array is ',DetailArray);
            } else {
                res.send({err: err})
            }
            console.log('The data from product table are: \n', rows.insertId);
        })
    });
});

// Delete a orders 
app.delete('/orderdetails/:Id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('DELETE FROM order_table.orderdetails WHERE order_Details_Id = ?', [req.params.Id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send({order_Details_Id: rows})
            } else {
                console.log(err)
            }
        })
    })
})
        

// Listen on enviroment port or 3009
app.listen(port, () => console.log(`Listen on port ${port}`))
 


/*
1 Javascript and Web Fundamentals
2 what is valiable is what is data types, if statement, for loop, while loop, function
3 es 6 hoisting scope 
4 algorithmic challenges 100
5 Cmputer science cs50
6 study from book you don't know javascript 
7 Asynchronuus js and dom
8 build project
9 function programming 
10 


*/ 