const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    tour:{type:mongoose.Schema.Types.ObjectId,ref:'Tour',required:true},
    numOfPeople:{
        type:Number,
        required:true,
        max:[5, 'Only five tickets are allowed to book']
    },
    dateBooking:{
        type:Date,
        default:Date.now
    },
    isCanceld:{
        type:Boolean,
        default:false 
    },
    isFavorite:{
        type:Boolean,
        default:false 
    },

})

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;