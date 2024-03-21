const  mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const favouritsSchema = new Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    tour:{type:mongoose.Schema.Types.ObjectId,ref:'Tour',required:true},
});

const Favourits = mongoose.model('Favourits', favouritsSchema);

module.exports = Favourits