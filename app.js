const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const stock = require('./models/stock');

const port = 3333;
// const mongoose = require('mongoose');

// Importing routerfiles
const userRouter = require('./routers/user');

const app = express();

// mongoose.connect('mongodb://localhost:27017/trading', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
// });
require('./db/db');

// app.use(express.json());

// MIDDLEWEAR

app.use(cors());

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Routes!
app.use('/user', userRouter);

// const ioPort = 3344;

const server = require('http').Server(app);

const io = require('socket.io')(server);

const companies = [
    {
        name: 'Volvo',
        price: [20],
        borderColor: ['#ddd'],
        borderWidth: 3,
        rate: 1.002,
        variance: 0.6,
    },
    {
        name: 'Saab',
        price: [20],
        borderColor: ['#4e3'],
        borderWidth: 3,
        rate: 1.001,
        variance: 0.4,
    },
];

// io.origins(['http://localhost']);
// io.origins(['https://jimmyandersson.me:443']);

io.on('connection', function(socket) {
    console.log('user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

setInterval(function() {
    companies.map(company => {
        company.price.push(stock.getStockPrice(company));
        if (company.price.length > 20) {
            company.price.shift();
        }
        return company;
    });

    console.log(companies);

    io.emit('stocks', companies);
}, 5000);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

module.exports = server;
