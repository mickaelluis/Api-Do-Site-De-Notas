const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});


noteSchema.index({'title': 'text', 'body': 'text'}) 

module.exports = mongoose.model('Note', noteSchema);