const { db } = require('./config');
const WebSocket = require('ws');
const { sendMessage } = require('./sendMessage');
function setRate(pair,newRate,server) {
    

    db.query('Update exchange_market set price = ? where symbol = ? ',[newRate,pair]);
    
    let tm = Date.now()/1000;
    let ntm = Math.floor(tm/60);
    let ntmn = ntm*60;
     
    let senddata = {time : ntmn,open : 0,low : 0, high : 0 , close :newRate , pair : pair}

    db.query('select * from exchange_rates where symbol = ? and time = ?  order by id desc limit 1',[pair,ntmn], (errn, rates) => {
        if (errn) {
            console.log('error',errn);
            // console.log('Error insert ');
            //  res.status(500).send('Error fetching users');
        } else {
            
            if(rates.length>0){
                
                let rates_element = rates[0];
                let high = newRate > rates_element.high ? newRate : rates_element.high;
                let low = newRate < rates_element.low ? newRate : rates_element.low;
                db.query("update `exchange_rates` set `low` = ?,`high` = ?,`close` =? where `symbol` = ? and `time` = ?",[low,high,newRate,pair,ntmn]);
                sendratemessage(pair,server);
            }else{
                
                db.query('select * from exchange_rates where symbol = ?  order by id desc limit 1',[pair], (errn, rates1) => {
                    if (errn) {
                        // console.log('Error insert ');
                        //  res.status(500).send('Error fetching users');
                    } else {
                         
                        if(rates1.length==0){
                            
                            db.query("insert into exchange_rates (`open`,`low`,`high`,`close`,`symbol`,`time`) values (?,?,?,?,?,?)",[0,0,newRate,newRate,pair,ntmn]);
                            sendratemessage(pair,server);
                        }else{
                             
                            let rates_element = rates1[0];
                             

                            let low = newRate > rates_element.close ? rates_element.close : newRate;
                            let high = newRate < rates_element.close ? rates_element.close : newRate;
                            db.query("insert into exchange_rates (`open`,`low`,`high`,`close`,`symbol`,`time`) values (?,?,?,?,?,?)",[rates_element.close,low,high,newRate,pair,ntmn]);
                            sendratemessage(pair,server);
                        }
                    }
                });                
            }
            

        }
    });

     
}

function sendratemessage(pair,server){
    db.query('select * from exchange_rates where symbol = ?  order by id desc limit 1',[pair], (errn, ratesn) => {
        if (errn) {
            // console.log('Error insert ');
            //  res.status(500).send('Error fetching users');
        } else {
            console.log('here')
            senddata = ratesn[0];
            sendMessage(server,senddata,'setRate');

        }
    })
}

module.exports = {
    setRate,
}