const Tour = require('../Model/tourModel');
const User = require('../Model/registerModel');
const Coupon = require('../Model/couponModel');
const ContactUs = require('../Model/contactUsModel');
const XLSX = require('xlsx');

exports.downloadExcel = async (req, res) => {
    const { collections } = req.body;

    try {
        const data = [];

        if (collections.includes('tours')) {
            const tours = await Tour.find().lean();
            tours.forEach(tour => {
                data.push({
                    Category: 'Tours',
                    _id: tour._id,
                    Title: tour.title,
                    Location: tour.location,
                    Destination: tour.destination,
                    Rating: tour.rating,
                    Description: tour.description,
                    Price: tour.price,
                    StartDate: tour.startDate,
                    EndDate: tour.endDate,
                    StartTime: tour.startTime,
                    EndTime: tour.endTime,
                    Duration: tour.duration,
                    MainImage: tour.images?.mainImage,
                    Type: tour.type,
                    LimitNumberOfTravelers: tour.limitNumberOfTravelers,
                    TotalTravelers: tour.totalTravelers,
                    EmptyPlaces: tour.emptyPlaces,
                    Highlights: tour.highlights?.map(highlight => highlight.details).join(', '),
                    Included: tour.included?.join(', '),
                    Excluded: tour.excluded?.join(', '),
                    Program: tour.program?.join(', '),
                    Latitude: tour.latitude,
                    Longitude: tour.longitude,
                    TouristReservations: tour.touristReservations?.length,
                    Featured: tour.Featured,
                    DiscountEndDate: tour.discountEndDate,
                    DiscountPercentage: tour.discountPercentage,
                    DiscountStartDate: tour.discountStartDate,
                    Points: tour.points,
                });
            });
        }

        if (collections.includes('users')) {
            const users = await User.find().lean();
            users.forEach(user => {
                data.push({
                    Category: 'Users',
                    _id: user._id,
                    Name: user.name,
                    Email: user.email,
                    Role: user.role,
                    CreatedAt: user.createdAt,
                    UpdatedAt: user.updatedAt
                });
            });
        }

        if (collections.includes('coupons')) {
            const coupons = await Coupon.find().lean();
            coupons.forEach(coupon => {
                data.push({
                    Category: 'Coupons',
                    _id: coupon._id,
                    Code: coupon.code,
                    Discount: coupon.discount,
                    ExpiryDate: coupon.expiryDate,
                    CreatedAt: coupon.createdAt,
                    UpdatedAt: coupon.updatedAt
                });
            });
        }

        if (collections.includes('contacts')) {
            const contacts = await ContactUs.find().lean();
            contacts.forEach(contact => {
                data.push({
                    Category: 'Contacts',
                    _id: contact._id,
                    FirstName: contact.firstName,
                    LastName: contact.lastName,
                    Email: contact.email,
                    Subject: contact.subject,
                    Message: contact.message,
                    CreatedAt: contact.createdAt,
                    UpdatedAt: contact.updatedAt
                });
            });
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

        const fileBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Data.xlsx');
        res.send(fileBuffer);

    } catch (error) {
        console.error('Error generating Excel:', error);
        res.status(500).json({ message: 'An error occurred while generating Excel' });
    }
};
