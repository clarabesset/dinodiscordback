const express = require('express');
const router = new express.Router();
const User = require('../models/User');
const getAll = () => User.find();
const getOne = (id) => User.findById(id);
const updateOne = (id, data) => User.findByIdAndUpdate(id, data);
const deleteOne = (id) => User.findByIdAndDelete(id);
const create = (data) => User.create(data);
router.post('/', (req, res) => {
	create(req.body)
		.then((users) => {
			res.status(200).send(users);
		})
		.catch((error) => res.status(500).send('Something went wrong'));
});
router.get('/', (req, res) => {
	getAll()
		.then((users) => {
			res.status(200).send(users);
		})
		.catch((error) => res.status(500).send('Something went wrong'));
});
router.get('/:id', (req, res) => {
	getOne(req.params.id)
		.then((user) => {
			res.status(200).send(user);
		})
		.catch((error) => res.status(500).send('Something went wrong'));
});
router.delete('/:id', (req, res) => {
	deleteOne(req.params.id)
		.then((users) => {
			res.status(200).send(articles);
		})
		.catch((error) => {
			res.status(500).send('Something went wrong');
		});
});
router.patch('/:id', (req, res) => {
	updateOne(req.params.id, req.body)
		.then((updatedDocument) => res.status(200).send(updatedDocument))
		.catch((error) => {
			res.status(500).send('Something went wrong');
		});
});
router.patch('/winner', (req, res) => {
	updateOne(req.params.id, req.body)
		.then((updatedDocument) => res.status(200).send(updatedDocument))
		.catch((error) => {
			res.status(500).send('Something went wrong');
		});
});
module.exports = {
	router,
	getAll,
	getOne,
	deleteOne,
	updateOne,
	create
};
