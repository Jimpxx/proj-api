const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/trading', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});
