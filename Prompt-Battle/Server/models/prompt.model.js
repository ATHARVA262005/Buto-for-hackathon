const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
    prompt: {
        type: String,
        required: true
    },
    generatedOutput: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    problemStatement: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    votedBy: [{
        type: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Prompt', promptSchema);
