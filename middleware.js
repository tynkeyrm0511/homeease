const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');

const applyMiddlewares = (app) => {
    app.use(morgan('dev')); // Ghi log các request HTTP
    app.use(cors()); // Cho phép các yêu cầu từ frontend
    app.use(helmet()); // Tăng cường bảo mật
    app.use(express.json()); // Xử lý dữ liệu JSON từ client
    app.use(express.urlencoded({ extended: true })); // Xử lý dữ liệu từ form
};

module.exports = applyMiddlewares;