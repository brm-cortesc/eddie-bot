const express = require('express'),
			app = express(),
			mysql = require('mysql'),
			connection = require('express-myconnection');


const db = {
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASS, 
	database: process.env.DB 
};

const { RTMClient, WebClient } = require('@slack/client');

const token = process.env.TOKEN; 

// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);


//:::::::::MYSQl::::::::://

// connection.connect( (err)=>{
// 	if(!err){
// 		console.log('conectado')
// 	}else{
// 		console.error('error al conectar')
// 	}

// });

// app.get('/', (req,res)=>{
// 	connection.query('SELECT * from information_schema.tables', (err,rows, fields)=>{
// 		connection.end();

// 		if(!err){
// 			console.log(rows)
// 		}else{
// 			console.error('no se puede hacer el la consulta')
// 		}


// 	});

// });




//:::::::::SLACK CLIENT::::::::://

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
// See the "Combining with the WebClient" topic below for an example of how to get this ID
const conversationId = 'CABLRMAPR';

rtm.start();

// Need a web client to find a channel where the app can post a message
const web = new WebClient(token);

const arr = [];

web.channels.list()
  .then((res) => {
  	// console.log('entre')
    // Take any channel for which the bot is a member
    // const channel = res.channels.find(c => c.is_member);

    const channel = res.channels.find((m) => m.id == conversationId );

    // console.log(res)

    arr.push(channel)

    if (channel) {
      // We now have a channel ID to post a message in!
      // use the `sendMessage()` method to send a simple string to a channel using the channel ID
      rtm.sendMessage('Holandas', channel.id)
        // Returns a promise that resolves when the message is sent
        .then((msg) => console.log(`Message sent to channel ${channel.name} with ts:${msg.ts}`))
        .catch(console.error);
    } else {
      console.log('This bot does not belong to any channel, invite it to at least one and try again');
    }
});

app.get('/', (req, res, next)=>{

	let users = [];
	for( let i=0; i <arr.members.length; i++  ){

		users.push(arr.members[i])
	}

	res.send(arr);

});

let cx = connection(mysql, db, 'request');

app.use(cx)
app.get('/query', (req,res, next)=>{
	req.getConnection( (err,cx) =>{
		cx.query('SELECT * from information_schema.tables', (err,rows, fields)=>{
			// connection.end();

			if(!err){
				// console.log(rows)

				res.send(rows);

			}else{
				console.error('no se puede hacer el la consulta')
			}


		});
	});

});


app.listen(process.env.PORT || 3000)

console.log('servidor en http://localhost:'+ 3000)


