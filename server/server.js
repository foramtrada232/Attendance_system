var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var usercontroller = require('./controller/user-controller');
var attendanceController = require('./controller/attendance-controller');

var bodyParser = require('body-parser');         

app.use(bodyParser.urlencoded({'extended':'true'}));           
app.use(bodyParser.json());                                    

var User = require('./models/user-model');
var Attendance = require('./models/attendance-model');

mongoose.connect("mongodb://localhost:27017/demo");
console.log("connected");

// user
app.post('/add',usercontroller.add);
app.get('/get',usercontroller.get);
app.get('/get/:id',usercontroller.getById);
app.delete('/delete/:id',usercontroller.delete);
app.put('/update/:id',usercontroller.update);

// attendance 
app.get('/checkin/:id',attendanceController.makeAttendanceByUserId);
app.get('/getAtendanceById/:id',attendanceController.getAttendanceById);
app.post('/getAtendanceByDate',attendanceController.getAttendanceByDate);
app.post('/getAttendanceByToFromDate',attendanceController.getAttendanceByToFromDate);
app.put('/getAttendanceByDiffAndUpdate/:userId/:logId/:aId', attendanceController.getAttendanceByDiffAndUpdate);


module.exports = app;


app.listen(9000);
console.log("App listening");