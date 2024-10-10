const WebSocket = require('ws');
const { manageSell } = require('./manageSell');
const { manageBuy } = require('./manageBuy');
const { db } = require('./config');
const { handleNewTrade } = require('./handleNewTrade');
 

 

const server = new WebSocket.Server({ port: 8080 });

 

server.on('connection', (ws) => {
  console.log('New client connected');

  // Send a welcome message to the client
  
   ws.on('message', (ev) => {
    // console.log(JSON.stringify(event));
            let event = ev;
          
        // if(ev=='trade'){
          const receivedArray = JSON.parse(event);
      // if(receivedArray.wstype=="newTrade"){
       
      // }    
      if(receivedArray.wstype=="trade"){
          console.log('Received Array:', receivedArray);
         
          db.query('select * from exchange_trades where id = ? and status = 0',[receivedArray.trade_id], (errn, results0) => {
              if (errn) {
                
              }else{
          
              
                // Broadcast the message to all connected clients
                results0.forEach((element0, index) => {   
                  handleNewTrade(server,element0);
                  let ttlPendingAmnt = parseFloat(parseFloat(element0.amount) - parseFloat(element0.filled));
                  manageSell(receivedArray,element0,ttlPendingAmnt,server);
                  // if(receivedArray.buysell=='sell'){
                  //   db.query('select * from exchange_trades where pair = ? and price >= ? and buysell= ? and spottype = ? and status = 0 order by id asc',[receivedArray.pair,receivedArray.price,'buy', 'limit'], (err, results) => {
                  //     if (err) {
                  //         // console.log('Error insert ');
                  //     //  res.status(500).send('Error fetching users');
                  //     } else {
                  //       // console.log('inserted ',results);
                  //       results.forEach((element, index) => {
                  //         if(ttlPendingAmnt > 0 ){            
                              
                  //             let miable = parseFloat(element.amount-element.filled);
                  //             let pending = miable;
                  //             if(parseFloat(miable)>parseFloat(ttlPendingAmnt)){
                  //               miable = parseFloat(ttlPendingAmnt);
                  //             }
          
                              
                  //             let stts = parseFloat(pending) - parseFloat(miable) <= 0 ? 1:0;
                              
                  //             // console.log(miable);
                  //             // console.log(ttlPendingAmnt);
          
                  //             let ttlpaid = parseFloat(element.filled+miable)
          
          
                  //             db.query('Update exchange_trades set filled = ?, status = ? where id = ? ',[ttlpaid,stts,element.id]);
                  //             ttlPendingAmnt = parseFloat(ttlPendingAmnt-miable)
                  //             let sendable = element;
                  //             sendable.filled = ttlpaid;
                  //             sendable.status = stts;
          
                  //             server.clients.forEach((client) => {
                  //                 // client !== ws &&
                  //               if ( client.readyState === WebSocket.OPEN) {
                  //                 client.send(JSON.stringify(sendable));
                  //               }
                  //             });
          
                  //             db.query('Update exchange_trades set filled = filled+? where id = ? ',[miable,receivedArray.trade_id]);
                  //             if(ttlPendingAmnt==0){
                  //               db.query('Update exchange_trades set status = 1 where id = ? ',[receivedArray.trade_id]);
                  //             }
          
                  //             db.query('Update exchange_market set price = ? where symbol = ? ',[element0.price,receivedArray.pair]);
                              
                  //             let tm = Date.now()/1000;
                  //             let ntm = Math.floor(tm/60);
                  //             let ntmn = ntm*60;
                              
                  //             // let rates = runQuery('select * from exchange_rates where symbol = ? and time = ?  order by id desc limit 1',[receivedArray.pair,ntmn]);
                  //             // if(rates.length>0){
                  //             //   let rates_element = rates[0];
                  //             //   let high = element0.price > rates_element.high ? element0.price : rates_element.high;
                  //             //   let low = element0.price < rates_element.low ? element0.price : rates_element.low;
                  //             //   db.query("update into exchange_rates set low = ?,high = ?,close =? where symbol = ? and time = ?",[low,high,element0.price,receivedArray.pair,ntmn]);
                  //             // }else{
                  //             //   let rates1 = runQuery('select * from exchange_rates where symbol = ?  order by id desc limit 1',[receivedArray.pair]);
                  //             //   console.log(rates1);
                  //             //   if(rates1.length==0){
                  //             //     db.query("insert into exchange_rates (`open`,`low`,`high`,`close`,`symbol`,`time`) values (?,?,?,?,?,?)",[0,0,element0.price,element0.price,receivedArray.pair,ntmn]);
                  //             //   }else{
                  //             //       let rates_element = rates1[0];
                                   
                  //             //       // let low = element0.price > rates_element.close ? rates_element.close : element0.price;
                  //             //       // let high = element0.price < rates_element.close ? rates_element.close : element0.price;
                  //             //       // db.query("insert into exchange_rates (`open`,`low`,`high`,`close`,`symbol`,`time`) values (?,?,?,?,?,?)",[rates_element.close,low,high,element0.price,receivedArray.pair,ntmn]);
                  //             //   }
                  //             // }
                               
                  //             db.query('select * from exchange_trades where id = ?',[receivedArray.trade_id], (errn, results1) => {
                  //               if (errn) {
                  //                   // console.log('Error insert ');
                  //               //  res.status(500).send('Error fetching users');
                  //               } else {
                  //                 results1.forEach((element, index) => {
                  //                   server.clients.forEach((client) => {
                  //                       // client !== ws &&
                  //                     if ( client.readyState === WebSocket.OPEN) {
                  //                       client.send(JSON.stringify(element));
                  //                     }
                  //                   });
                  //                 })
                  //               }
                  //             });
          
                  //           }
                  //         });
                  //     // res.json(results);
                  //     }
                  //   });
                  // }
          
                  let ttlBuyPendingAmnt = parseFloat(parseFloat(element0.amount) - parseFloat(element0.filled));
                  manageBuy(receivedArray,ttlBuyPendingAmnt,server);
                  // if(receivedArray.buysell=='buy'){
                  //   db.query('select * from exchange_trades where pair = ? and price <= ? and buysell= ? and spottype = ? and status = 0 order by id asc',[receivedArray.pair,receivedArray.price,'sell', 'limit'], (err, results) => {
                  //     if (err) {
                  //         console.log('Error insert ');
                  //     //  res.status(500).send('Error fetching users');
                  //     } else {
                  //       //  console.log('inserted ',results);
                  //       results.forEach((element, index) => {
                  //         if(ttlBuyPendingAmnt > 0 ){            
                              
                  //             let miable = parseFloat(element.amount-element.filled);
                  //             let pending = miable;
                  //             if(parseFloat(miable)>parseFloat(ttlBuyPendingAmnt)){
                  //               miable = parseFloat(ttlBuyPendingAmnt);
                  //             }
          
                              
                  //             let stts = parseFloat(pending) - parseFloat(miable) <= 0 ? 1:0;
                              
                  //             // console.log(miable);
                  //             // console.log(ttlBuyPendingAmnt);
          
                  //             let ttlpaid = parseFloat(element.filled+miable)
          
          
                  //             db.query('Update exchange_trades set filled = ?, status = ? where id = ? ',[ttlpaid,stts,element.id]);
                  //             ttlBuyPendingAmnt = parseFloat(ttlBuyPendingAmnt-miable)
          
                  //             let sendable = element;
                  //             sendable.filled = ttlpaid;
                  //             sendable.status = stts;
          
                  //             server.clients.forEach((client) => {
                  //                 // client !== ws &&
                  //               if ( client.readyState === WebSocket.OPEN) {
                  //                 client.send(JSON.stringify(sendable));
                  //               }
                  //             });
          
                  //             db.query('Update exchange_trades set filled = filled+? where id = ? ',[miable,receivedArray.trade_id]);
                  //             if(ttlBuyPendingAmnt==0){
                  //               db.query('Update exchange_trades set status = 1 where id = ? ',[receivedArray.trade_id]);
                  //             }
          
                  //             db.query('Update exchange_market set price = ? where symbol = ? ',[receivedArray.price,receivedArray.pair]);
                              
                  //             db.query('select * from exchange_rates where symbol = ? order by id desc limit 1',[receivedArray.pair], (errn, rates) => {
                  //               if (errn) {
                  //                   // console.log('Error insert ');
                  //               //  res.status(500).send('Error fetching users');
                  //               } else {
                  //                 rates.forEach((rates_element, index) => {
                  //                   let high = receivedArray.price < rates_element.close ? rates_element.close : receivedArray.price;
                  //                   let low = receivedArray.price > rates_element.close ? rates_element.close : receivedArray.price;
                  //                   db.query("insert into exchange_rates (`open`,`low`,`high`,`close`,`symbol`,`time`) values (?,?,?,?,?,?)",[rates_element.close,low,high,receivedArray.price,receivedArray.pair,Date.now()/1000]);
                  //                 });
                  //                 if(rates.length==0){
                  //                   db.query("insert into exchange_rates (`open`,`low`,`high`,`close`,`symbol`,`time`) values (?,?,?,?,?,?)",[0,0,receivedArray.price,receivedArray.price,receivedArray.pair,Date.now()/1000]);
                  //                 }
                  //               }
                  //             })
                  //             db.query('select * from exchange_trades where id = ?',[receivedArray.trade_id], (errn, results1) => {
                  //               if (errn) {
                  //                   // console.log('Error insert ');
                  //               //  res.status(500).send('Error fetching users');
                  //               } else {
                  //                 results1.forEach((element, index) => {
                  //                   server.clients.forEach((client) => {
                  //                       // client !== ws &&
                  //                     if ( client.readyState === WebSocket.OPEN) {
                  //                       client.send(JSON.stringify(element));
                  //                     }
                  //                   });
                  //                 })
                  //               }
                  //             });
                  //           }
                  //         });
                  //     // res.json(results);
                  //     }
                  //   });
                  // }
                });
              }
          });
      }

      if(receivedArray.wstype=="rate"){
        let pair = receivedArray.pair;
        let rate = receivedArray.rate;
         //console.log(rate);
        db.query('select * from exchange_trades where price >= ? and buysell = ? and status = 0 and pair = ? ',[rate,'buy',pair], (errn, results0) => {
          if (errn) {
            // console.log('Error insert ');
            } else {
               
              results0.forEach((element, index) => {
                // console.log(element);
                
                db.query('Update exchange_trades set filled = ?, status = 1 where id = ? ',[element.amount,element.id]);
                console.log('buy');
                let sendable = element;
                sendable.filled = element.amount;
                sendable.status = 1;

                
                let curr2 = element.buysell=='buy' ? element.base : element.quote;

                db.query('Update user_wallets set amount = amount + ? where user_id = ? and currency = ? ',[element.amount,element.user_id,curr2]);

                server.clients.forEach((client) => {
                    // client !== ws &&
                  if ( client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(sendable));
                  }
                });

              });
            }
        });

        db.query('select * from exchange_trades where price <= ? and buysell = ? and status = 0 and pair = ? ',[rate,'sell',pair], (errn, results0) => {
          if (errn) {
            // console.log('Error insert ');
            } else {
               
              results0.forEach((element, index) => {
               
               
                db.query('Update exchange_trades set filled = ?, status = 1 where id = ? ',[element.amount,element.id]);
                console.log('sell');
                let sendable = element;
                sendable.filled = element.amount;
                sendable.status = 1;

                let curr2 = element.buysell=='buy' ? element.base : element.quote;
                let xnm = element.amount*element.price;

                db.query('Update user_wallets set amount = amount + ? where user_id = ? and currency = ? ',[xnm,element.user_id,curr2]);

                server.clients.forEach((client) => {
                    // client !== ws &&
                  if ( client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(sendable));
                  }
                });

              });
            }
        });


      }
    });
  
  //ws.send('Welcome to the WebSocket server!');
   ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080'+Date.now());
