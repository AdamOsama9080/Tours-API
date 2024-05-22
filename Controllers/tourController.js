const { model } = require('mongoose');
const Tour = require('../Model/tourModel');
const nodemailer = require('nodemailer');
const User = require('../Model/registerModel');
const cron = require('node-cron');
const Subscription = require('../Model/subscribeModel');


async function sendDiscountEmailToUsers(emails, discountPercentage, discountStartDate, discountEndDate) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'khalilkapo15@gmail.com',
                pass: 'vhpvalolvducobya'
            },
            tls: {
                rejectUnauthorized: false 
            }
        });

        const mailOptions = {
            from: 'khalilkapo15@gmail.com', 
            to: emails.join(','), // Join emails into a single string
            subject: 'New Tour Discount Available!',
            text: `Dear traveler,

                    We are excited to inform you about a new discount on our tours! Enjoy a ${discountPercentage}% discount from ${new Date(discountStartDate).toLocaleDateString()} to ${new Date(discountEndDate).toLocaleDateString()}.

                    Visit our website to book your discounted tour now!

                    Best regards,
                    The Tour Management Team`
                };

        await transporter.sendMail(mailOptions);
        console.log('Emails sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}



async function sendEmailToUsers(emails, tourTitle, tourLocation) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'khalilkapo15@gmail.com',
                pass: 'vhpvalolvducobya'
            },
            tls: {
                rejectUnauthorized: false 
            }
        });

        const mailOptions = {
            from: 'khalilkapo15@gmail.com', 
            to: emails,
            subject: 'Changes in Tour Details',
            text: `Dear traveler,\n\nThe tour "${tourTitle}" in ${tourLocation} has been updated. Please visit our site again to view the changes.\n\nBest regards,\nThe Tour Management Team`
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}

module.exports = {
    sendEmailToUsers,
    getAllTours: async (req, res) => {
        try {
            let allTours = await Tour.find({});
            res.status(200).json({ message: "success", data: allTours });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    getRelatedTours: async (req, res) => {
        try {
            const { location } = req.body;
            const today = new Date();
            today.setHours(0, 0, 0, 0); 
    
            const relatedTours = await Tour.find({
                location: location,
                emptyPlaces: { $ne: 0 }, 
                startDate: { $gt: today } 
            });
    
            if (relatedTours.length === 0) {
                return res.status(200).json({ status: 'success', message: 'No related tours found.' });
            }
    
            res.status(200).json({ status: 'success', data: relatedTours });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },
    

    createTour: async (req, res) => {
        try {
            const { limitNumberOfTravelers, ...tourData } = req.body;
            tourData.limitNumberOfTravelers = limitNumberOfTravelers;
            tourData.emptyPlaces = limitNumberOfTravelers;

            const tour = await Tour.create(tourData);
            res.status(200).json({
                status: 'success',
                data: {
                    tour,
                },
            });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    updateTour: async (req, res) => {
        try {
            const id = req.params.id;
            const updateFields = req.body;
    
            const allowedFields = ['description', 'price', 'startDate', 'endDate', 'startTime', 'endTime', 'duration', 'images', 'mainImage', 'type', 'limitNumberOfTravelers', 'emptyPlaces', 'highlights', 'details', 'included', 'excluded', 'program'];
    
            const invalidFields = Object.keys(updateFields).filter(field => !allowedFields.includes(field));
            if (invalidFields.length > 0) {
                return res.status(400).json({ status: 'error', message: `Invalid fields: ${invalidFields.join(', ')}` });
            }
    
            const tour = await Tour.findById(id);
    
            if (updateFields.limitNumberOfTravelers && updateFields.limitNumberOfTravelers !== tour.limitNumberOfTravelers) {
                const diff = updateFields.limitNumberOfTravelers - tour.limitNumberOfTravelers;
                updateFields.limitNumberOfTravelers = updateFields.limitNumberOfTravelers;
                updateFields.emptyPlaces = tour.emptyPlaces + diff;
            }
    
            const updatedTour = await Tour.findByIdAndUpdate(id, updateFields, { new: true });

            const userIds =  tour.touristReservations.map(reservation => reservation.userId);
    
            const users = await User.find({ _id: { $in: userIds } });
            const userEmails = users.map(user => user.email);
    
            await sendEmailToUsers(userEmails, updatedTour.title, updatedTour.location);
    
            res.status(200).json({
                status: 'success',
                data: {
                    tour: updatedTour,
                },
            });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    deleteTour: async (req, res) => {
        try {
            const id = req.params.id;
            const tour = await Tour.findByIdAndDelete(id);
            if (!tour) {
                return res.status(404).json({ status: 'error', message: 'Tour not found' });
            }
            res.status(200).json({
                status: 'success',
                data: {
                    tour: tour
                }
            })
        }catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },
    
    getOneTour: async (req, res) => {
        try {
            const tour = await Tour.findById(req.params.id);
            if (!tour) {
                return res.status(404).json({ status: 'error', message: 'Tour not found' });
            }
            res.status(200).json({
                status: 'success',
                data: tour,
            });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    filterionTrip: async (req, res) => {
        try {
            const { destination, startDate, endDate, numberOfTravelers } = req.body;

            const trips = await Tour.find({
                location: destination,
                startDate: { $gte: startDate },
                endDate: { $lte: endDate }
            });

            const filteredTrips = trips.filter(trip => {
                const emptyPlaces = trip.limitNumberOfTravelers - trip.totalTravelers;
                return numberOfTravelers <= emptyPlaces;
            });

            if (filteredTrips.length > 0) {
                res.status(200).json({ status: 'success', data: filteredTrips });
            } else {
                res.status(404).json({ status: 'error', message: 'No trips found matching the criteria.' });
            }
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    createDiscount: async (req, res) => {
        try {
            const { location, discountPercentage, discountStartDate, discountEndDate } = req.body;

            if (!location || !discountPercentage || !discountStartDate || !discountEndDate) {
                return res.status(400).json({ success: false, message: 'All fields are required!' });
            }

            const filter = location === 'All Tour' ? {} : { location: location };
            const update = {
                discountPercentage: discountPercentage,
                discountStartDate: new Date(discountStartDate),
                discountEndDate: new Date(discountEndDate)
            };

            const result = await Tour.updateMany(filter, update);
            console.log('Update Result:', result);

            const discountEndDateObj = new Date(discountEndDate);
            const timeoutDuration = discountEndDateObj.getTime() - Date.now();

            setTimeout(async () => {
                const resetResult = await Tour.updateMany(filter, { discountPercentage: 0, discountStartDate: null, discountEndDate: null });
                console.log('Reset Result:', resetResult);
            }, timeoutDuration);

            const users = await User.find({});
            const userEmails = users.map(user => user.email);

            await sendDiscountEmailToUsers(userEmails, discountPercentage, discountStartDate, discountEndDate);

            res.status(200).json({ success: true, message: 'Discount added successfully and emails sent!' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
