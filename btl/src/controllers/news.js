const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    header: { type: String, required: true },
    content: { type: String, required: true }
}, { timestamps: true }); // Adding timestamps option

const News = mongoose.model('News', newsSchema);
module.exports = News;
