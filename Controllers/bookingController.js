const { model } = require('mongoose');
const Booking = require('../Model/bookingModel');
const Tour = require('../Model/tourModel');
const Favourits = require('../Model/favouritsModel');

module.exports = {
    getAllBookingById:async (req,res)=>{
        try {
            // Fetch all bookings for the user
            let allBookings = await Booking.find({ user: req.params.userid }).populate('tour');
    
            // Fetch all favorited tours by the user
            let favoritedTours = await Favourits.find({ user: req.params.userid }).distinct('tour');
            favoritedTours = favoritedTours.map(tour => tour.toString());

            // Iterate through each booking
            allBookings = allBookings.map(booking => {
                // Check if the tour in the booking is favorited by the user
                booking.isFavorite = favoritedTours.includes(booking.tour._id.toString());
                return booking;
            });
    
            res.status(200).json({ message: "success", data: allBookings });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },
    Booking:async (req,res)=>{
        try {
            const isFoundedBooking = await Booking.findOne({ user: req.body.user, tour: req.body.tour });
        
            if (!isFoundedBooking || (isFoundedBooking && isFoundedBooking.isCanceld)) {
                let tour = await Tour.findById(req.body.tour);
        
                if (tour.limitNumberOfTravelers - tour.totalTravelers >= req.body.numOfPeople) {
                    const booking = new Booking(req.body);
                    await booking.save();
        
                    tour.touristReservations.push({
                        userId: req.body.user,
                        numberOfTravelers: req.body.numOfPeople
                    })
                    let updatedTour = await Tour.findByIdAndUpdate(req.body.tour, {
                        totalTravelers: tour.totalTravelers + req.body.numOfPeople,
                        emptyPlaces: tour.emptyPlaces - req.body.numOfPeople,
                        touristReservations:tour.touristReservations
                    }, { new: true });
        
                    return res.send("Booking is successful");
                }
                // {
                //     "_id": "65f1931d6b78daee97f09e36",
                //     "numberOfTravelers": 20
                // }
                return res.send("Not enough available spots for booking");
            } else {
                return res.send("You are already booked for this tour");
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            return res.status(500).send("An error occurred while processing your request");
        }
        
    }

    ,
    updateBooking:async(req,res)=>{
        // Find the booking document
    const booking = await Booking.findOne({ user: req.body.user, tour: req.body.tour , isCanceld:false});

    if (booking) {
    booking.isCanceld = !booking.isCanceld;
    const updatedBooking = await booking.save();
    let tour = await Tour.findById(req.body.tour);
    let updatedTour = await Tour.findByIdAndUpdate(req.body.tour, {
        totalTravelers: tour.totalTravelers - booking.numOfPeople,
        emptyPlaces: tour.emptyPlaces + booking.numOfPeople,
        touristReservations:tour.touristReservations.filter((tr)=>{
            if(tr.userId != req.body.user){
                return tr;
            }
        })
    }, { new: true });
    res.json(updatedBooking);
    } else {
        res.status(404).json({ error: "Booking not found" });
    }

     }
    

}