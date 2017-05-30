/*Bulletin Board Application Create a website that allows people to post messages to a page. A message consists of a title and a body. The site should have two pages:

The first page shows people a form where they can add a new message.
The second page shows each of the messages people have posted. Make sure there's a way to navigate the site so users can access each page.
Messages must be stored in a postgres database. Create a "messages" table with three columns: column name / column data type:

id: serial primary key
title: text
body: text*/


const fs = require('fs')
const express = require('express')
const pg = require ('pg')
const pug = require('pug')

const app = express();

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.set('views', './src/views');
app.set('view engine', 'pug');

var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';
// connection string. Anyone can use this app, no need for username and password.

const server = app.listen(8080, () => {
    console.log('server has started at ', server.address().port)
}); // application is listens to the request. And everytime the browser goes to localhost:8080 it will print out "Server has started at".


// The first page shows people a form where they can add a new message. 
app.get('/', (req, res) => {
	res.render('index')
});

app.post('/', (req, res) => {
	var title = req.body.title;
	var body = req.body.message;

// the application will connect to the sql database
	pg.connect(connectionString, function(err, client, done) {

 	 client.query('insert into messages (title, body) values (\'' + title + '\', \'' + body +'\')', function(err) {
			if(err) {
			throw err;
		}
 	 }); // the database is connected. The values which are inserted in the form will be inserted to the SQL messages table.

		done();
		res.redirect('/bulletinboard'); // after submitting the page gets redirected to the bulletinboard
	});
});



/*The second page shows each of the messages people have posted. 
Make sure there's a way to navigate the site so users can access each page.*/


app.get('/bulletinboard', (req, res) => {
	
	pg.connect(connectionString, function (err, client, done) {
	
	client.query('select * from messages', function (err, result) {
		if (err) {
			throw err;
		} // we request all the rows from table messages

		var messages = result.rows; // table is assigned to variable messages.

		res.render('messages', {messages: messages}); 

		done();
		pg.end();
	});
	});
});


