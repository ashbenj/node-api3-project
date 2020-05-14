const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');

const server = express();

server.use(express.json());
server.use(helmet());
// server.use(morgan('dev'));
server.use(logger);
server.use(addName);

server.use('/users', userRouter);
server.use('/posts', postRouter);

server.get('/', (req, res) => {
	const nameInsert = req.name ? ` ${req.name}` : '';

	res.send(`
  <h2>Lambda Hubs API</h2>
  <p>Welcome${nameInsert} to the Lambda Hubs API`);
});

//custom middleware

function logger(req, res, next) {
	console.log(req.method);
	next();
}

function addName(req, res, next) {
	if (!req.name) {
		req.name = 'Asha';
	}
	next();
}

function validateUserId(req, res, next) {}

module.exports = server;
