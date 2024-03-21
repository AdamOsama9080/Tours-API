const { getAllBookingById, Booking, updateBooking } = require('../Controllers/bookingController')

const bookingRouters = require('express').Router()

bookingRouters.get('/:userid',getAllBookingById)
bookingRouters.put('/',updateBooking)
bookingRouters.post('/',Booking)



module.exports = bookingRouters;