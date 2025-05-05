const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI
            // , {
            // useUnifiedTopology: true,
            // useNewUrlParser: true
            // }
            //Looks like I dont need the above because they are 'depreciated'?
        );
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB