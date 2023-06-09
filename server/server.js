//----V7-------------------5/11/23

const express = require('express')
const cors = require('cors')
const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('postgres://postgres:Philip6212@@52.3.57.185:5432/js_db')
const path = require('path')

const app = express()
app.use(express.json());
app.use(express.static('./client'))


//-------Creating order model----------

const pizza_orders = sequelize.define("pizza_orders", {

    user_id: {
      type: Sequelize.INTEGER
    },
    first_name: {
      type: Sequelize.STRING
    },
    last_name: {
        type: Sequelize.STRING
    },
    order_id: {
        type: Sequelize.INTEGER
    },
    item_id: {
        type: Sequelize.STRING
    },
    total_price: {
        type: Sequelize.INTEGER
    },
    quantity: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.STRING
    }
  },
  {
    timestamps: false
  });



function createRows(arr)
{
  
    pizza_orders.bulkCreate(arr).then(() => console.log("Users data have been saved"));
    console.log("Bulk create")

}

//----------------------------------

console.log("PATH", __dirname)


app.get('/', function(req, res){
   
   console.log(req.body)
    res.sendFile(path.join(__dirname), '../client/index.html');
    
});


app.post('/seed', (req,res) => {
    sequelize.query (`
    drop table if exists cities;
    drop table if exists countries;
    create table cities (
        city_id SERIAL primary key, 
        name varchar(50)
        );

    `).then(() => {
        console.log('DB seeded!')
        res.json('SEEDED !!')
        })
    

})

app.post('/adduser', (req,res) =>{
    
    let {firstName, lastName} = req.body

    sequelize.query (`
    
        insert into users (user_name, user_lastname)
        values ('${firstName}','${lastName}');

    `).then(() => {
        console.log('User info iserteD !')
        //res.json('SEEDED !!')
        })
    // console.log(firstName)
    // console.log("RECEIVED",req.body)

    
    res.status(200).send(req.body);
   
})

app.get('/getallusers', (req,res) => {
    sequelize.query(`
                SELECT * 
                FROM users
              
                `).then((dbRes) => {
                        console.log('REQUESTING USERS')
                        console.log(dbRes[0])
                        res.status(200).send(dbRes[0])
})
})

app.post('/addpizzaitems', (req,res)=>{
    sequelize.query (`
    insert into pizzastoreitems
    (name,price)
        values 
        ('Large Pizza',9.50),
        ('Medium Pizza',7.50),
        ('Small Pizza',5.50),
        ('Stromboli',8.50),
        ('Soda',2.50)


    `).then(() => {
        console.log('Pizza store menu is ready!')
        res.json('Pizza store menu is ready!')
        })
    


})

app.get('/getpizzaitems', (req,res)=>{
    sequelize.query(`
                SELECT * 
                FROM pizzastoreitems
                `).then((dbRes) => {
                        console.log('REQUESTING USERS')
                        console.log(dbRes[0])
                        res.status(200).send(dbRes[0])

})})

app.post('/addmenuitem',(req,res)=>{
    let {newItemname,newItemprice} = req.body
    
    sequelize.query (`
    insert into pizzastoreitems
    (name,price)
        values 
        ('${newItemname}','${newItemprice}')
        
    `)

    console.log("Adding new item to DB", newItemname,newItemprice)
    res.status(200).send('SERVER RESPONSE')

})


app.post('/createorder',(req,res)=>{

    console.log(req.body)
    createRows(req.body)

})


app.get('/seeorders',(req,res)=>{
    sequelize.query(`
    select user_id, item_id, 
    quantity, status from pizza_orders
                `).then((dbRes) => {
                    console.log('REQUESTING ORDERS')
                        console.log(dbRes[0])
                        res.status(200).send(dbRes[0])
                   
                })

})

app.delete('/deletefrommenu/:index',(req,res) => {
    let { index } = req.params

    sequelize.query(`
    delete from pizzastoreitems 
    where item_id = '${index}'
                `)

    console.log("SERVER",index)
    
    res.status(200).send(index)
})

app.get('/orderstatus/:index',(req,res) => {
    let { index } = req.params

    console.log(index)
    sequelize.query(`
    select status from pizza_orders 
    where order_id = '${index}'
                `).then((dbRes) => {
                    console.log('REQUESTING ORDERS')
                        console.log(dbRes[0])
                        res.status(200).send(dbRes[0])
                   
                })

})

app.put('/orderstatus/:index',(req,res) => {
    let { index } = req.params

    console.log(index)
    sequelize.query(`
    UPDATE pizza_orders
    SET status = 'READY'
    where order_id = '${index}'
                `).then((dbRes) => {
                    console.log('CHANGING STATUS of ', index)
                        console.log(dbRes[0])
                        res.status(200).send(dbRes[0])
                   
                })

})

app.delete('/deletefromorders/:index',(req,res) => {
    let { index } = req.params

    sequelize.query(`
    delete from pizza_orders 
    where order_id = '${index}'
                `)

    console.log("SERVER",index)
    
    res.status(200).send(index)
})


app.get('/searchorder/:index',(req,res) => {
    let { index } = req.params

    console.log(index)
    sequelize.query(`
    select order_id, total_price, last_name, status from pizza_orders 
    where last_name = '${index}'
                `).then((dbRes) => {
                    console.log('REQUESTING ORDERS BY LAST NAME')
                        console.log(dbRes[0])
                        res.status(200).send(dbRes[0])
                   
                })

})

app.listen(80, () => console.log('UP an RUNNING on 80'))