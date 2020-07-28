const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    postedBy: { //relación de collecciones (tablas) en mongoDB
        type: ObjectId,
        ref: 'User'
    }
})

mongoose.model('Post', postSchema);