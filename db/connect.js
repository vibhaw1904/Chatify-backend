const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI, {
           
        });
        console.log(`DB IS CONNECTED ${connect.connection.host}`);
    } catch (error) {
        console.error("Server is NOT connected to Database:", error.message);
        process.exit(1);
    }
};

module.exports = connectDb;
