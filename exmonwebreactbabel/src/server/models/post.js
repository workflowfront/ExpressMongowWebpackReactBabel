import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    title: String,
    time: String,
    content: String,
    timestamp: String,
    hash:String,
    author: String
});

module.exports = postSchema;
