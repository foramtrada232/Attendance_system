const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let attendanceSchema = new Schema({

    userId: { type: Schema.Types.ObjectId, ref: 'User' },

    log: [{
        date: { type: Date, default: Date.now },
        attendance: [{
            entry: { type: Date, default: Date.now },
            exit: { type: Date, default: null },
            difference: { type: Number },
        }],
    }],
    user: [{
        name: { type: String },
        gender: { type: String },
        isDelete: { type: Boolean, default: false }
    }]

});

module.exports = mongoose.model('Attendance', attendanceSchema);