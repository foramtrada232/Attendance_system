var attendanceModel = require('../models/attendance-model');
var userModel = require('../models/user-model');
var attendanceController = {};
var _ = require('lodash');
const ObjectId = require('mongodb').ObjectId;
attendanceController.makeAttendanceByUserId = function (req, res) {
	userModel.findOne({ _id: req.params.id })
		.exec((err, userFound) => {
			if (err) {
				res.status(500).send(err);
			} else if (userFound) {
				attendanceModel.findOne({ userId: req.params.id })
					.exec((err, user) => {
						if (err) {
							res.status(500).send(err);
						} else if (user) {
							console.log(user);
							var outerLen = user.log.length;
							var innerLen = user.log[outerLen - 1].attendance.length;
							console.log("lengths", outerLen, innerLen);
							if (new Date(user.log[outerLen - 1].date).toDateString() == new Date().toDateString()) {
								console.log(new Date().toDateString());
								if (user.log[outerLen - 1].attendance[innerLen - 1].exit == null) {

									user.log[outerLen - 1].attendance[innerLen - 1].exit = Date.now();

									var difference = user.log[outerLen - 1].attendance[innerLen - 1].exit.getTime() - user.log[outerLen - 1].attendance[innerLen - 1].entry.getTime();

									user.log[outerLen - 1].attendance[innerLen - 1].difference = difference;

									user.save((errr, attends) => {
										if (errr) {
											res.status(500).send(errr);
										} else {
											res.status(200).send(attends);
										}

									})

								} else {
									var data = { attendance: [{ entry: Date.now(), exit: null }] };
									user.log.push(data);
									user.save((err, attend) => {
										if (err) {
											res.status(500).send(err);
										} else {
											res.status(200).send(attend);
										}

									})

								}

							} else {
								var data = { date: Date.now(), attendance: [{ entry: Date.now(), exit: null }] };
								user.log.push(data);
								user.save((err, attend) => {
									if (err) {
										res.status(500).send(err);
									} else {
										res.status(200).send(attend);
									}

								})

							}
						} else {
							var data = {
								userId: req.params.id,
								log: [{ date: Date.now(), attendance: [{ entry: Date.now(), exit: null }] }]
							}

							var att = new attendanceModel(data);

							att.save((error, attendance) => {

								if (error) {
									res.status(500).send(error);
								} else {
									res.status(200).send(attendance);
								}
							})
						}

					})
			} else {
				console.log("user not found");
			}
		})
}

attendanceController.getAttendanceById = function (req, res) {
	attendanceModel.findOne({ userId: req.params.id })

		.exec((err, foundUser) => {

			if (err) {
				res.status(500).send(err);
			} else {
				res.status(200).send(foundUser);
			}
		})
}

attendanceController.getAttendanceByDate = function (req, res) {
	var user = [];
	attendanceModel.find({})
		.populate('userId', { name: 1 })
		.exec((err, foundUser) => {

			_.forEach(foundUser, (foundLogs) => {
				console.log("foundUser=================>", foundLogs);
				_.forEach(foundLogs.log, (flogs) => {

					if (new Date(flogs.date).toDateString() == new Date(req.body.date).toDateString()) {
						console.log(new Date(flogs.date).toDateString());
						var obj = {
							userId: foundLogs.userId,
							log: foundLogs.log

						};
						user.push(obj);
					}
				})
			})
			res.status(200).send(user);
		})
}

attendanceController.getAttendanceByToFromDate = function (req, res) {
	var record = [];
	attendanceModel.find({})
		.populate('userId', { name: 1 })
		.exec((err, found) => {
			console.log(found);
			var obj = {
				userId: found.userId,
				log: found.log
			};
			record.push(obj);
		})
}

attendanceController.getAttendanceByDiffAndUpdate = function (req, res) {
	console.log("Aid:", req.params.aId);
	console.log("lId:", req.params.logId);
	console.log("difference:", req.body.difference);
	attendanceModel.update({}, {
		$set: { 'log.$[logs].attendance.$[atten].difference': req.body.difference }},
		{ arrayFilters: [{'logs._id':req.params.logId}, {'atten._id': req.params.aId }] }
	  ).exec((err, data) => {
		  console.log("data:",data)
				if (data) {
					console.log("data:", data);
					res.status(200).send(data);
				} else {
					console.log("HELLO:")
					res.status(400).send(err)
				}
		});
}


module.exports = attendanceController;