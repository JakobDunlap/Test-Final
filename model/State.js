const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//idk if this is right, maybe its just supposed to be state, state abbrv and fun fact?
const stateSchema = new Schema({
    stateCode: {
        type: String,
        required: true,
        unique: true
    },
    funfacts: {
        type: [String]
    }
});

module.exports = mongoose.model('State', stateSchema);
//^^ becuase we write State here, mongoose will look for the lowecase plural, 'states'^^