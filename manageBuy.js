const mysql = require('mysql2');
const WebSocket = require('ws');
const { sendMessage } = require('./sendMessage');
const { db } = require('./config');
const { setRate } = require('./setRate');
 

function manageBuy(receivedArray,ttlBuyPendingAmnt,server) { 
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

                  sendMessage(server,sendable,'tradeExecute');
                 
                  db.query('Update exchange_trades set filled = filled+? where id = ? ',[miable,receivedArray.trade_id]);
                  if(ttlBuyPendingAmnt==0){
                    db.query('Update exchange_trades set status = 1 where id = ? ',[receivedArray.trade_id]);
                  }
 
                  db.query('Update user_wallets set amount = amount+? where user_id = ? and currency = ?',[miable,receivedArray.user_id,receivedArray.base]);
                  // console.log('query',"Update user_wallets set amount = amount+? where user_id = ? and currency = ?");
                  // console.log('amount',miable);
                  // console.log('user_id',receivedArray.user_id);
                  // console.log('currency',receivedArray.base);
                  ///////////// changeee set rate //////////////
                  setRate(receivedArray.pair,receivedArray.price,server);
                  // db.query('Update exchange_market set price = ? where symbol = ? ',[receivedArray.price,receivedArray.pair]);
                  
                  // db.query('select * from exchange_rates where symbol = ? order by id desc limit 1',[receivedArray.pair], (errn, rates) => {
                  //   if (errn) {
                  //       // console.log('Error insert ');
                  //   //  res.status(500).send('Error fetching users');
                  //   } else {
                  //     rates.forEach((rates_element, index) => {
                  //       let high = receivedArray.price < rates_element.close ? rates_element.close : receivedArray.price;
                  //       let low = receivedArray.price > rates_element.close ? rates_element.close : receivedArray.price;
                  //       db.query("insert into exchange_rates (`open`,`low`,`high`,`close`,`symbol`,`time`) values (?,?,?,?,?,?)",[rates_element.close,low,high,receivedArray.price,receivedArray.pair,Date.now()/1000]);
                  //     });
                  //     if(rates.length==0){
                  //       db.query("insert into exchange_rates (`open`,`low`,`high`,`close`,`symbol`,`time`) values (?,?,?,?,?,?)",[0,0,receivedArray.price,receivedArray.price,receivedArray.pair,Date.now()/1000]);
                  //     }
                  //   }
                  // })
                   ///////////// changeee set rate //////////////
                  db.query('select * from exchange_trades where id = ?',[receivedArray.trade_id], (errn, results1) => {
                    if (errn) {
                        // console.log('Error insert ');
                    //  res.status(500).send('Error fetching users');
                    } else {
                      results1.forEach((element, index) => {
                        sendMessage(server,element,'tradeExecute');
                        
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
    manageBuy,
}