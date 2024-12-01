const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/lostandfound', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    dateLost: Date,
    dateFound: Date,
    contactInfo: String,
    status: String // 'lost' or 'found'
});

const Item = mongoose.model('Item', itemSchema);

// Routes

// Report a lost item
app.post('/report-lost', async (req, res) => {
    const { name, description, dateLost, contactInfo } = req.body;
    const newItem = new Item({
        name,
        description,
        dateLost,
        contactInfo,
        status: 'lost'
    });
    await newItem.save();
    res.status(201).send('Lost item reported');
});

// Report a found item
app.post('/report-found', async (req, res) => {
    const { name, description, dateFound, contactInfo } = req.body;
    const newItem = new Item({
        name,
        description,
        dateFound,
        contactInfo,
        status: 'found'
    });
    await newItem.save();
    res.status(201).send('Found item reported');
});

// Search for lost and found items
app.get('/search', async (req, res) => {
    const { status, name } = req.query;
    const query = { status };

    if (name) {
        query.name = { $regex: name, $options: 'i' };
    }

    const items = await Item.find(query);
    res.status(200).json(items);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
