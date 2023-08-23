const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ReturnItem = require('./models/ReturnItem');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/returnsDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(error => {
    console.log('Error connecting to MongoDB:', error.message);
});

app.get('/returns', async (req, res) => {
    try {
        const returns = await ReturnItem.find();
        res.json(returns);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/returns', async (req, res) => {
    const returnItem = new ReturnItem(req.body);
    try {
        const savedItem = await returnItem.save();
        res.json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/returns/:id', async (req, res) => {
    try {
        const updatedReturn = await ReturnItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedReturn);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/returns/:id', async (req, res) => {
    console.log('Attempting to delete:', req.params.id);
    try {
        await ReturnItem.findByIdAndDelete(req.params.id);
        res.json({ message: "Return deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting return" });
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
