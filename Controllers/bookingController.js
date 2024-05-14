const { model } = require('mongoose');
const Booking = require('../Model/bookingModel');
const Tour = require('../Model/tourModel');
const User = require('../Model/registerModel');
const Favourits = require('../Model/favouritsModel');
const nodemailer = require('nodemailer');

async function generateUniqueTourCode() {
    const lastBooking = await Booking.findOne().sort({ tripCode: -1 }).limit(1);
    let lastTourCode = 11111; // Default starting code
    if (lastBooking) {
        lastTourCode = lastBooking.tripCode + 1;
    }
    return lastTourCode;
}


module.exports = {
    getAllBookingById:async (req,res)=>{
        try {
            let allBookings = await Booking.find({ user: req.params.userid }).populate('tour');
            let favoritedTours = await Favourits.find({ user: req.params.userid }).distinct('tour');
            favoritedTours = favoritedTours.map(tour => tour.toString());
            allBookings = allBookings.map(booking => {
                booking.isFavorite = favoritedTours.includes(booking.tour._id.toString());
                return booking;
            });
    
            res.status(200).json({ message: "success", data: allBookings });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },
    // Booking:async (req,res)=>{
    //     try {
    //         const isFoundedBooking = await Booking.findOne({ user: req.body.user, tour: req.body.tour });
        
    //         if (!isFoundedBooking || (isFoundedBooking && isFoundedBooking.isCanceld)) {
    //             let tour = await Tour.findById(req.body.tour);
        
    //             if (tour.limitNumberOfTravelers - tour.totalTravelers >= req.body.numOfPeople) {
    //                 const booking = new Booking(req.body);
    //                 await booking.save();
        
    //                 tour.touristReservations.push({
    //                     userId: req.body.user,
    //                     numberOfTravelers: req.body.numOfPeople
    //                 })
    //                 let updatedTour = await Tour.findByIdAndUpdate(req.body.tour, {
    //                     totalTravelers: tour.totalTravelers + req.body.numOfPeople,
    //                     emptyPlaces: tour.emptyPlaces - req.body.numOfPeople,
    //                     touristReservations:tour.touristReservations
    //                 }, { new: true });
        
    //                 return res.send("Booking is successful");
    //             }
    //             return res.send("Not enough available spots for booking");
    //         } else {
    //             return res.send("You are already booked for this tour");
    //         }
    //     } catch (error) {
    //         console.error('Error creating booking:', error);
    //         return res.status(500).send("An error occurred while processing your request");
    //     }
        
    // }

    Booking: async (req, res) => {
        try {
            const totalTravelers = req.body.travelers.length;
            if (totalTravelers > 5) {
                return res.status(400).json({ message: "You can book up to a maximum of 5 travelers" });
            }

            const existingBooking = await Booking.findOne({ user: req.body.user, tour: req.body.tour ,isCanceld:false});
            if (existingBooking) {
                return res.status(400).json({ message: "You have already booked for this tour. You can only update your booking." });
            }

            const tour = await Tour.findById(req.body.tour);
            if (tour.emptyPlaces < totalTravelers && tour.limitNumberOfTravelers > tour.totalTravelers) {
                return res.status(400).json({ message: "Not enough available spots for booking" });
            }

            const tourCode = await generateUniqueTourCode();

            const booking = new Booking({
                ...req.body,
                tripCode: tourCode
            });
            await booking.save();

            tour.totalTravelers += totalTravelers;
            tour.emptyPlaces -= totalTravelers;
            tour.touristReservations.push({ userId: req.body.user });
            await tour.save();

            const user = await User.findById(req.body.user);
            const travelerNames = req.body.travelers.map(traveler => ` - ${traveler.firstName} ${traveler.lastName}`).join('\n');
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'khalilkapo15@gmail.com',
                    pass: 'zwxntcgqnqxuyedv'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const mailOptions = {
                from: 'khalilkapo15@gmail.com',
                to: user.email,
                subject: 'Booking Confirmation',
                text: `Your booking for tour ${tourCode} is confirmed.\n\nTrip details: ${tour.description}.\n\nTravelers:\n${travelerNames} \n\nTotal price: ${totalTravelers * tour.price}€ and you can cancel it before ${tour.startDate} if you want .\n\nIf you have any questions, please contact us at 0uS1I@example.com`
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            const response = {
                bookingId: booking._id,
                user: {
                    userId: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                },
                tour: {
                    title: tour.title,
                    location: tour.location,
                    destination: tour.destination,
                    price: tour.price,
                    startDate: tour.startDate,
                    endDate: tour.endDate,
                    duration: tour.duration,
                    totalTravelers: tour.totalTravelers,
                    description: tour.description
                },
                numOfPeople: totalTravelers,
                travelers: req.body.travelers,
                totalPrice: totalTravelers * tour.price,
                tripCode: tourCode
            };

            return res.status(200).json(response);
        } catch (error) {
            console.error('Error creating booking:', error);
            return res.status(500).json({ message: "An error occurred while processing your request" });
        }
    },

    // updateBooking:async(req,res)=>{
    // const booking = await Booking.findOne({ user: req.body.user, tour: req.body.tour , isCanceld:false});

    // if (booking) {
    // booking.isCanceld = !booking.isCanceld;
    // const updatedBooking = await booking.save();
    // let tour = await Tour.findById(req.body.tour);
    // let updatedTour = await Tour.findByIdAndUpdate(req.body.tour, {
    //     totalTravelers: tour.totalTravelers - booking.numOfPeople,
    //     emptyPlaces: tour.emptyPlaces + booking.numOfPeople,
    //     touristReservations:tour.touristReservations.filter((tr)=>{
    //         if(tr.userId != req.body.user){
    //             return tr;
    //         }
    //     })
    // }, { new: true });
    // res.json(updatedBooking);
    // } else {
    //     res.status(404).json({ error: "Booking not found" });
    // }

    //  }

    cancelBooking: async (req, res) => {
        try {
            const booking = await Booking.findOne({ user: req.body.user, tour: req.body.tour , isCanceld:false});
    
            if (booking) {
                booking.isCanceld = true; // Set isCanceld to true to cancel the booking
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
    
                const user = await User.findById(req.body.user);    
                const response = {
                    bookingId: updatedBooking._id,
                    user: {
                        userId: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    },
                    tour: {
                        title: tour.title,
                        location: tour.location,
                        destination: tour.destination,
                        price: tour.price,
                        startDate: tour.startDate,
                        endDate: tour.endDate,
                        duration: tour.duration,
                        totalTravelers: tour.totalTravelers,
                        description: tour.description
                    },
                    numOfPeople: booking.numOfPeople,
                    travelers: booking.travelers,
                    totalPrice: booking.numOfPeople * tour.price,
                    tripCode: booking.tripCode,
                    message: "Booking successfully canceled"
                };
    
                return res.status(200).json(response);
            } else {
                res.status(404).json({ error: "Booking not found or already canceled" });
            }
        } catch (error) {
            console.error('Error canceling booking:', error);
            return res.status(500).json({ message: "An error occurred while canceling the booking" });
        }
    }
}