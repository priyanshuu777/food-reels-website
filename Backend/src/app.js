//yahaan server create hoga
const express = require('express');//kyu ki express framework ka use kar rahe hain
const app = express();//express ka function jo app create karta hai
const cookieParser = require('cookie-parser');//to parse cookies (parse mtlb jo bhi cookies aayengi unko read karne ke liye)
const authRoutes = require('./routes/auth.routes');//
const foodRoutes = require('./routes/food.routes');
const cors = require('cors');//to allow cross origin requests
const foodPartnerRoutes = require('./routes/food-partner.routes');
app.use(cors({
    origin: 'http://localhost:5173',//yeh front-end ka address hai jahan se requests aayengi
    credentials: true,//yeh isliye taaki cookies bheji jaa sake
}));
app.use(cookieParser());//to parse cookies mtlb jo bhi cookies aayengi unko parse karne ke liye
app.use(express.json());//to parse json data
//basic route
app.get ('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/auth', authRoutes);//yeh route hai jahan par user apna data bhejega register karne ke liye
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);


const buyRoutes = require('./routes/buy.routes');
const paymentRoutes = require('./routes/payment.routes');

app.use('/api/buy', buyRoutes);
app.use('/api/payment', paymentRoutes);
module.exports = app;