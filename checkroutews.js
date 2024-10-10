const WebSocket = require('ws');
// const server = new WebSocket.Server({ port: 8080 });




const express = require('express');
const enableWs = require('express-ws');

const app = express()
enableWs(app)

app.ws('/echo', (ws, req) => {
    //console.log(server);
    
         
        ws.on('message', msg => {
            ws.send(msg)
        })
        ws.on('close', () => {
            console.log('WebSocket was closed')
        })
    
    

    
})
app.ws('/check1', (ws, req) => {
    ws.on('message', msg => {
        ws.send(msg)
    })

    ws.on('close', () => {
        console.log('WebSocket was closed')
    })
})

app.listen(8080)