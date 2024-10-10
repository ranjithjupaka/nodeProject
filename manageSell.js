const mysql = require('mysql2');
const WebSocket = require('ws');
const { db } = require('./config');
const { setRate } = require('./setRate');
const { sendMessage } = require('./sendMessage');
 

function manageSell(receivedArray,element0,ttlPendingAmnt,server) {    

    if(receivedArray.buysell=='sell'){
        db.query('select * from exchange_trades where pair = ? and price >= ? and buysell= ? and spottype = ? and status = 0 order by id asc',[receivedArray.pair,receivedArray.price,'buy', 'limit'], (err, results) => {
        if (err) {
            // console.log('Error insert ');
        //  res.status(500).send('Error fetching users');
        } else {
            // console.log('inserted ',results);
            results.forEach((element, index) => {
            if(ttlPendingAmnt > 0 ){            
                
                let miable = parseFloat(element.amount-element.filled);
                let pending = miable;
                if(parseFloat(miable)>parseFloat(ttlPendingAmnt)){
                    miable = parseFloat(ttlPendingAmnt);
                }

                
                let stts = parseFloat(pending) - parseFloat(miable) <= 0 ? 1:0;
                
                // console.log(miable);
                // console.log(ttlPendingAmnt);

                let ttlpaid = parseFloat(element.filled+miable)


                db.query('Update exchange_trades set filled = ?, status = ? where id = ? ',[ttlpaid,stts,element.id]);
                ttlPendingAmnt = parseFloat(ttlPendingAmnt-miable)
                let sendable = element;
                sendable.filled = ttlpaid;
                sendable.status = stts;

                sendMessage(server,sendable,'tradeExecute');
                // server.clients.forEach((client) => {
                //     // client !== ws &&
                //     if ( client.readyState === WebSocket.OPEN) {
                //     client.send(JSON.stringify(sendable));
                //     }
                // });

                db.query('Update exchange_trades set filled = filled+? where id = ? ',[miable,receivedArray.trade_id]);
                if(ttlPendingAmnt==0){
                    db.query('Update exchange_trades set status = 1 where id = ? ',[receivedArray.trade_id]);
                }

                // db.query('Update exchange_market set price = ? where symbol = ? ',[element0.price,receivedArray.pair]);
                
                // let tm = Date.now()/1000;
                // let ntm = Math.floor(tm/60);
                // let ntmn = ntm*60;

                db.query('Update user_wallets set amount = amount+? where user_id = ? and currency = ?',[miable*element0.price,receivedArray.user_id,receivedArray.quote]);

                setRate(receivedArray.pair,element0.price,server);


                db.query('select * from exchange_trades where id = ?',[receivedArray.trade_id], (errn, results1) => {
                    if (errn) {
                        // console.log('Error insert ');
                    //  res.status(500).send('Error fetching users');
                    } else {
                    results1.forEach((element, index) => {
                        sendMessage(server,element,'tradeExecute');
                        // server.clients.forEach((client) => {
                        //     // client !== ws &&
                        // if ( client.readyState === WebSocket.OPEN) {
                        //     client.send(JSON.stringify(element));
                        // }
                        // });
                    })
                    }
                });

                }
            });
        // res.json(results);
        }
        });
    }
}
module.exports = {
    manageSell,
}