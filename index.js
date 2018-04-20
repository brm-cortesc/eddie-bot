const express = require('express');
const mysql = require('mysql');
const connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASS,
	database: process.env.DB
})


const { RTMClient, WebClient } = require('@slack/client');


// An access token (from your Slack app or custom integration - usually xoxb)
const token = process.env.TOKEN; 

// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);
// rtm.start();

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
// See the "Combining with the WebClient" topic below for an example of how to get this ID
// const conversationId = 'C1232456';
rtm.start();

// Need a web client to find a channel where the app can post a message
const web = new WebClient(token);

web.channels.list()
  .then((res) => {
  	// console.log('entre')
    // Take any channel for which the bot is a member
    const channel = res.channels.find(c => c.is_member);

    console.log(res)

    if (channel) {
      // We now have a channel ID to post a message in!
      // use the `sendMessage()` method to send a simple string to a channel using the channel ID
      rtm.sendMessage('Hello, world!', channel.id)
        // Returns a promise that resolves when the message is sent
        .then((msg) => console.log(`Message sent to channel ${channel.name} with ts:${msg.ts}`))
        .catch(console.error);
    } else {
      console.log('This bot does not belong to any channel, invite it to at least one and try again');
    }
});

