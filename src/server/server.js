const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
require('dotenv').config();
 
const app = express();
const port = 5000;
 
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
 
// Route handler for the root URL
app.get('/', (req, res) => {
    res.send('Server is running successfully.'); // You can customize this response message
});
 
 
 
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});
 
con.connect((err) => {
    if (err) throw err;
    else console.log('Connected!');
});
 
function CompletePayment(user) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate a payment success or failure with a random boolean
            resolve(true);
        }, 2000); // Simulate a network delay of 2 seconds
    });
}
 
app.post('/api/admission', async (req, res) => {
    try {
        // Validate and store data in the admissions table
        const { name, age, batch } = req.body;
 
        // Perform necessary validations
        if (age < 18 || age > 65) {
            return res.status(400).json({ success: false, error: 'Invalid age' });
        }
 
        // Insert admission record
        con.query('INSERT INTO admissions (name, age, batch) VALUES (?, ?, ?)', [name, age, batch], async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ success: false, error: 'Internal Server Error' });
            }
 
            const admissionId = results.insertId;
 
            // Call CompletePayment function (mocked)
            const paymentSuccessful = await CompletePayment(req.body);
 
            if (paymentSuccessful) {
                // Insert payment record in the payments table
                const amount = 500; // Assuming a fixed amount for simplicity
                con.query('INSERT INTO payments (admission_id, amount) VALUES (?, ?)', [admissionId, amount], (error) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ success: false, error: 'Internal Server Error' });
                    }
 
                    res.json({ success: true, admissionId });
                });
            } else {
                res.json({ success: false, error: 'Payment failed' });
            }
        });
 
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
 
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});