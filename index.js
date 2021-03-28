const express = require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
const MongoClient = require('mongodb').MongoClient;
const app = express()

app.use(bodyParser.json())
app.use(cors())

const uri = `mongodb+srv://emaWatson:riaz017ksn@cluster0.enpeg.mongodb.net/emaJohnStore?retryWrites=true&w=majority`;

require('dotenv').config()
const port = 5000

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection= client.db("emaJohnStore").collection("products");
  const ordersCollection= client.db("emaJohnStore").collection("orders");
 
  app.post('/addProduct',(req,res)=>{
      const products=req.body;
      productsCollection.insertMany(products)
      .then(result=>{
          res.send(result.insertedCount)
      })

  })



  app.get('/products',(req,res)=>{

    productsCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  app.get('/product/:key',(req,res)=>{

    productsCollection.find({key: req.params.key})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
  })

  
app.post('/productByKeys',(req,res)=>{
  const productKeys=req.body;
  productsCollection.find({key: {$in: productKeys}})
  .toArray((err,documents)=>{
    res.send(documents)
  })
})



app.post('/addOrder',(req,res)=>{
  const order=req.body;
  ordersCollection.insertOne(order)
  .then(result=>{
      res.send(result.insertedCount > 0)
  })

})




});







app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)