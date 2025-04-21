const app = require("./app")
const http = require("http")
const dbconnection = require('./config/db')

port= process.env.PORT || 6000
const server =http.createServer(app)

server.listen(port,()=>{
    dbconnection()
    console.log(`server is listening on port http://localhost:${port}`)})