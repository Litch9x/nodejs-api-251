const mongoose = require('mongoose');
const tokenSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
const TokenModel = mongoose.model('Token', tokenSchema, 'tokens');
module.exports = TokenModel;