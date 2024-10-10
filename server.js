const WebSocket = require('ws');
const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'exc'
  });

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (ws) => {
  console.log('New client connected');

  // Send a welcome message to the client
  ws.send('Welcome to the WebSocket server!');

  // Handle incoming messages from clients
  ws.on('message', (event) => {
    console.log(event);

    const receivedArray = JSON.parse(event);
    console.log('Received Array:', receivedArray.pair);
    // const ssdd = new WebSocket('wss://fstream.binance.com/stream?streams=btcusdt@markPrice');
    // ssdd.onmessage = (event) => {
    //   console.log(JSON.parse(event.data));
    // }
    // ssdd.terminate();
    // ssdd.close();
    // setTimeout( ssdd.close()  , 5000);
    db.query('select * from exchange_trades where id = ? and status = 0',[receivedArray.trade_id], (errn, results0) => {
    if (errn) {
      
    }else{

    
      // Broadcast the message to all connected clients
      results0.forEach((element0, index) => {        
        let ttlPendingAmnt = parseFloat(parseFloat(element0.amount) - parseFloat(element0.filled));
        if(receivedArray.buysell=='sell'){
          db.query('select * from exchange_trades where pair = ? and price >= ? and buysell= ? and spottype = ? and status = 0 order by id asc',[receivedArray.pair,receivedArray.price,'buy', 'limit'], (err, results) => {
            if (err) {
                console.log('Error insert ');
            //  res.status(500).send('Error fetching users');
            } else {
              console.log('inserted ',results);
              results.forEach((element, index) => {
                if(ttlPendingAmnt > 0 ){            
                    
                    let miable = parseFloat(element.amount-element.filled);
                    let pending = miable;
                    if(parseFloat(miable)>parseFloat(ttlPendingAmnt)){
                      miable = parseFloat(ttlPendingAmnt);
                    }

                    
                    let stts = parseFloat(pending) - parseFloat(miable) <= 0 ? 1:0;
                    
                    console.log(miable);
                    console.log(ttlPendingAmnt);

                    let ttlpaid = parseFloat(element.filled+miable)


                    db.query('Update exchange_trades set filled = ?, status = ? where id = ? ',[ttlpaid,stts,element.id]);
                    ttlPendingAmnt = parseFloat(ttlPendingAmnt-miable)
                    let sendable = element;
                    sendable.filled = ttlpaid;
                    sendable.status = stts;

                    server.clients.forEach((client) => {
                        // client !== ws &&
                      if ( client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(sendable));
                      }
                    });

                    db.query('Update exchange_trades set filled = filled+? where id = ? ',[miable,receivedArray.trade_id]);
                    if(ttlPendingAmnt==0){
                      db.query('Update exchange_trades set status = 1 where id = ? ',[receivedArray.trade_id]);
                    }

                    db.query('Update exchange_market set price = ? where symbol = ? ',[element0.price,receivedArray.pair]);

                    db.query('select * from exchange_trades where id = ?',[receivedArray.trade_id], (errn, results1) => {
                      if (errn) {
                          // console.log('Error insert ');
                      //  res.status(500).send('Error fetching users');
                      } else {
                        results1.forEach((element, index) => {
                          server.clients.forEach((client) => {
                              // client !== ws &&
                            if ( client.readyState === WebSocket.OPEN) {
                              client.send(JSON.stringify(element));
                            }
                          });
                        })
                      }
                    });

                  }
                });
            // res.json(results);
            }
          });
        }

        let ttlBuyPendingAmnt = parseFloat(parseFloat(element0.amount) - parseFloat(element0.filled));
        if(receivedArray.buysell=='buy'){
          db.query('select * from exchange_trades where pair = ? and price <= ? and buysell= ? and spottype = ? and status = 0 order by id asc',[receivedArray.pair,receivedArray.price,'sell', 'limit'], (err, results) => {
            if (err) {
                console.log('Error insert ');
            //  res.status(500).send('Error fetching users');
            } else {
              //  console.log('inserted ',results);
              results.forEach((element, index) => {
                if(ttlBuyPendingAmnt > 0 ){            
                    
                    let miable = parseFloat(element.amount-element.filled);
                    let pending = miable;
                    if(parseFloat(miable)>parseFloat(ttlBuyPendingAmnt)){
                      miable = parseFloat(ttlBuyPendingAmnt);
                    }

                    
                    let stts = parseFloat(pending) - parseFloat(miable) <= 0 ? 1:0;
                    
                    // console.log(miable);
                    // console.log(ttlBuyPendingAmnt);

                    let ttlpaid = parseFloat(element.filled+miable)


                    db.query('Update exchange_trades set filled = ?, status = ? where id = ? ',[ttlpaid,stts,element.id]);
                    ttlBuyPendingAmnt = parseFloat(ttlBuyPendingAmnt-miable)

                    let sendable = element;
                    sendable.filled = ttlpaid;
                    sendable.status = stts;

                    server.clients.forEach((client) => {
                        // client !== ws &&
                      if ( client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(sendable));
                      }
                    });

                    db.query('Update exchange_trades set filled = filled+? where id = ? ',[miable,receivedArray.trade_id]);
                    if(ttlBuyPendingAmnt==0){
                      db.query('Update exchange_trades set status = 1 where id = ? ',[receivedArray.trade_id]);
                    }

                    db.query('Update exchange_market set price = ? where symbol = ? ',[element.price,receivedArray.pair]);

                    db.query('select * from exchange_trades where id = ?',[receivedArray.trade_id], (errn, results1) => {
                      if (errn) {
                          // console.log('Error insert ');
                      //  res.status(500).send('Error fetching users');
                      } else {
                        results1.forEach((element, index) => {
                          server.clients.forEach((client) => {
                              // client !== ws &&
                            if ( client.readyState === WebSocket.OPEN) {
                              client.send(JSON.stringify(element));
                            }
                          });
                        })
                      }
                    });
                  }
                });
            // res.json(results);
            }
          });
        }
      });
    }
  });

    // server.clients.forEach((client) => {
    //     // client !== ws &&
    //   // if ( client.readyState === WebSocket.OPEN) {
    //   //   client.send(message);
    //   // }
    // });
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
