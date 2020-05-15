const express = require('express');
const User = require('./userDb');
const Post = require('../posts/postRouter');

const router = express.Router();
const cors = require('cors');

router.use(cors());

//insert(): calling insert passing it a resource object will add it to the database and return the new resource.
router.post('/', validateUser, (req, res) => {
	const user = req.body;

	User.insert(user)
		.then((user) => {
			res.status(201).json(user);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ errorMessage: 'Could not add this user, sorry' });
		});
});

//insert(): calling insert passing it a resource object will add it to the database and return the new resource.
router.post('/:id/posts', validateUserId, (req, res) => {
	const newPost = req.body;

	Post.insert(newPost)
		.then((post) => {
			res.status(201).json(post);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ errorMessage: 'No posts for you' });
		});
});

//get(): calling find returns a promise that resolves to an array of all the resources contained in the database.
router.get('/', (req, res) => {
	User.get()
		.then((users) => {
			res.status(200).json(users);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ errorMessage: 'Cannot' });
		});
});

//getById(): takes an id as the argument and returns a promise that resolves to the resource with that id if found.
router.get('/:id', validateUserId, (req, res) => {
	res.status(200).json(req.user);
});

//getById(): takes an id as the argument and returns a promise that resolves to the resource with that id if found.
router.get('/:id/posts', validateUserId, (req, res) => {
	const { id } = req.params;

	User.getUserPosts(id)
		.then((posts) => {
			if (posts.length) {
				res.status(200).json(posts);
			} else {
				res.status(400).json({
					errorMessage: `Sorry, User ${req.params.id} has no posts yet`,
				});
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				errorMessage: `ID #${req.params.id} does not have any comments`,
			});
		});
});

//remove(): the remove method accepts an id as it's first parameter and, upon successfully deleting the resource from the database, returns the number of records deleted.
router.delete('/:id', validateUserId, (req, res) => {
	User.remove(req.params.id)
		.then(() => {
			return res.status(200).json({ message: `ID #${req.params.id} is out` });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ errorMessage: `Cannot change #${id}` });
		});
});

//update(): accepts two arguments, the first is the id of the resource to update and the second is an object with the changes to apply. It returns the count of updated records. If the count is 1 it means the record was updated correctly.
router.put('/:id', validateUserId, (req, res) => {
	const { id } = req.params;
	const userUpdate = req.body;

	User.update(id, userUpdate)
		.then((user) => {
			if (user) {
				User.getById(id)
					.then((user) => {
						res.status(200).json(user);
					})
					.catch((err) => {
						console.log(err);
						res.status(500).json({ errorMessage: 'Could not get user' });
					});
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ errorMessage: 'Could not update this user' });
		});
});

//custom middleware

//`validateUserId()`
//`validateUserId` validates the user id on every request that expects a user id parameter
//if the `id` parameter is valid, store that user object as `req.user`
//if the `id` parameter does not match any user id in the database, cancel the request and respond with status `400` and `{ message: "invalid user id" }`
function validateUserId(req, res, next) {
	const { id } = req.params;

	User.getById(id).then((user) => {
		if (user) {
			req.user = user;
			next();
		} else {
			res
				.status(400)
				.json({ errorMessage: `Invalid user ID of #${req.params.id}` });
		}
	});
}

//`validateUser()`
//`validateUser` validates the `body` on a request to create a new user
//if the request `body` is missing, cancel the request and respond with status `400` and `{ message: "missing user data" }`
//if the request `body` is missing the required `name` field, cancel the request and respond with status `400` and `{ message: "missing required name field" }`
function validateUser(req, res, next) {
	const { name } = req.body;

	if (!name) {
		return res.status(400).json({ errorMessage: 'Cannot be empty' });
	}
	req.body = { name };
	next();
}

//`validatePost()`
//`validatePost` validates the `body` on a request to create a new post
//if the request `body` is missing, cancel the request and respond with status `400` and `{ message: "missing post data" }`
//if the request `body` is missing the required `text` field, cancel the request and respond with status `400` and `{ message: "missing required text field" }`
function validatePost(req, res, next) {
	const { id: user_id } = req.params;
	const { text } = req.body;

	if (!req.body || !{ text }) {
		return res.status(400).json({ errorMessage: 'Cannot be empty' });
	}
	req.body = { user_id, text };
	next();
}

module.exports = router;
