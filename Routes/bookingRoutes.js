const { getAllBookingById, Booking, cancelBooking } = require('../Controllers/bookingController')

const bookingRouters = require('express').Router()

bookingRouters.get('/:userid', getAllBookingById)
bookingRouters.put('/', cancelBooking)
bookingRouters.post('/', Booking)



module.exports = bookingRouters;