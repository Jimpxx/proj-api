const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const stock = require('./models/stock');

const port = 1338;

// Importing routerfiles
const userRouter = require('./routers/user');

const app = express();

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

const server = require('http').Server(app);

const io = require('socket.io')(server);

const companies = [
    {
        label: 'Volvo',
        data: [20],
        borderColor: ['#0000cd'],
        borderWidth: 3,
        rate: 1.002,
        variance: 0.6,
    },
    {
        label: 'Saab',
        data: [20],
        borderColor: ['#f51010'],
        borderWidth: 3,
        rate: 1.001,
        variance: 0.4,
    },
    {
        label: 'Tesla',
        data: [20],
        borderColor: ['#00ff00'],
        borderWidth: 3,
        rate: 1.003,
        variance: 0.7,
    },
];

// Uncomment when in production
io.origins(['https://project.jimmyandersson.me:443']);

io.on('connection', function(socket) {
    console.log('user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

setInterval(function() {
    companies.map(company => {
        company.data.push(stock.getStockPrice(company));
        if (company.data.length > 20) {
            company.data.shift();
        }
        return company;
    });

    // console.log(companies);

    io.emit('stocks', companies);
}, 5000);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = server;
