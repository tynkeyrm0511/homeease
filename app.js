//import thu vien express
const express = require('express');
//Tao ung dung express
const app = express();
//Cac route
app.get('/', (req, res) => {
    res.send('Chào mừng bạn đến với HomeEase!');
});

//Port
const PORT = 3000;
//Chay ung dung
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
})