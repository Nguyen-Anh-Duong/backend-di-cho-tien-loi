'use strict'

const {default: mongoose} = require('mongoose')

const connectString = 'mongodb://localhost:27017/di-cho-tien-loi'

mongoose.connect(connectString)
    .then(_=> console.log("Connect MongoDB successfully!!"))
    .catch(error => console.log("Connect error!!"))

module.exports = mongoose