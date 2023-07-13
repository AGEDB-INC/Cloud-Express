const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    projectName: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },

});

module.exports = mongoose.model('Project', projectSchema);



