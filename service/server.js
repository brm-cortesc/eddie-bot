const express = require('express'),
			app = express(),
			mysql = require('mysql'),
			connection = require('express-myconnection');
			router = express.Router(),
			http = require('http').Server(app)
			io = require("socket.io")(http),
			config = require('./config/');

const { RTMClient, WebClient } = require('@slack/client');

const token = process.env.TOKEN; 

// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);


const cx = connection(mysql, config.db, 'request');
let ot="";
let usuario="";
let temp="";

//:::::::::SLACK CLIENT::::::::://

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
// See the "Combining with the WebClient" topic below for an example of how to get this ID
const conversationId = 'CABLRMAPR';

rtm.start();

// Need a web client to find a channel where the app can post a message
const web = new WebClient(token);

router
	.use(cx)
	.get('/', (req,res, next)=>{

		//Obtenemos y guardamos la ultima tarea
		req.getConnection( (err,cx) =>{
			cx.query('SELECT * FROM otb_tarea', (err,rows, fields)=>{
				if(!err){
					ot = rows.slice(-1);

					console.log('id usuario asignado:', ot[0].idUsuarioAsignado);
					res.send('okay')
	
				}else{
					console.error('no se puede hacer el la consulta');
					res.send(err)
				}

			});
		});

		//Obtenemos usuario de la tarea
		req.getConnection( (err,cx) =>{
			cx.query('SELECT * FROM otb_usuario', (err,rows, fields)=>{
				if(!err){
					// ot = rows.slice(-1);

					usuario = rows.find((user) => user.id == ot[0].idUsuarioAsignado);

					console.log('data usuarios')
					console.log(usuario.correo)
		
				}else{
					console.error('no se puede hacer el la consulta');
					res.send(err)
				}

			});
		});

		web.channels.list()
		  .then((res) => {
			    const channel = res.channels.find((m) => m.id == conversationId );
			    
			    web.users.list()
			    	.then((res)=>{
			    		//se obtiene el usuario//
			    		// let temp = 'U9U0P6RQF';

			    		for(let i = 0; i < res.members.length; i++ ){

			    			if( res.members[i].profile.email == usuario.correo ){
			    				console.log( 'el usuario de slack es:', res.members[i])

			    				temp = res.members[i].id;
			    			}

			    		}

			    		let user = res.members.find((id) => id.id == temp);

		  	    	console.log('usuario slack: ', user)

		  		    if (channel) {
		  		      rtm.sendMessage(`Holandas <@${temp}>`, channel.id)
		  		        // Returns a promise that resolves when the message is sent
		  		        .then((msg) => console.log(`Message sent to channel ${channel.name} with ts:${msg.ts}`))
		  		        .catch(console.error);
		  		    } else {
		  		      console.log('This bot does not belong to any channel, invite it to at least one and try again');
				    }
			    
			    });


		});


});

app.use(router)






app.listen(process.env.PORT || config.port)

console.log('servidor en http://localhost:'+ config.port)