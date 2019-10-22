const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors')


const app = express();

app.use(cors());

const server = require('http').Server(app);
const io = require('socket.io')(server)

const url = 'mongodb+srv://omnistack:omnistack@cluster0-qkf5f.mongodb.net/test?retryWrites=true&w=majority';
const options = { reconnectTries: Number.MAX_VALUE, reconnectInterval: 500, poolSize: 5, useNewUrlParser: true,  useUnifiedTopology: true};

io.on('connection', socket => {
    socket.on('connectRoom', box =>{
        socket.join(box);
    })
})

mongoose.connect(url, options)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static(path.resolve(__dirname, '..', 'temp')));

app.use((req, res, next) => {
    req.io = io;

    return next();
})

app.use(require('./routes'))

server.listen(process.env.PORT || 8080);

