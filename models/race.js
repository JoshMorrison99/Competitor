const mongoose = require('mongoose')

const raceSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],   
	startDate: { type: Date, required: true },   
	endDate: { type: Date, required: true },  
    distance: { type: Number, required: true }
})

module.exports = mongoose.model('Run', raceSchema)