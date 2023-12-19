import React, { useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Container,
} from '@mui/material';
 
function CompletePayment(user) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a payment success or failure with a random boolean
      resolve(true);
    }, 2000); // Simulate a network delay of 2 seconds
  });
}
 
function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(18);
  const [batch, setBatch] = useState('');
  const [payment, setPayment] = useState(500);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setPaymentStatus('');
 
    // Basic client-side validation
    if (!name || age < 18 || age > 65 || !batch) {
      setError('Invalid input. Please check your details.');
      return;
    }
 
    const user = { name, age, batch, payment };
 
    try {
      const response = await axios.post('https://yoga-server-5x9084ff1-keyush-parwals-projects.vercel.app/api/admission', user);
      console.log(response.data);
 
      // Assume CompletePayment() is a function that takes user details and payment amount and returns a promise
      const paymentResponse = await CompletePayment(user);
      setPaymentStatus(paymentResponse ? 'Payment successful' : 'Payment failed');
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };
 
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
 
  return (
    <Container
      sx={{
        backgroundImage: 'url("https://example.com/yoga-background.jpg")', // Replace with your actual image URL
        backgroundSize: 'cover',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '10%', // Adjust the left margin as needed
        '@media (min-width: 1700px)': {
          height: '80vh',
        },
      }}
    >
      <Card sx={{ maxWidth: 400, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Yoga Admission Form
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Age"
              variant="outlined"
              type="number"
              fullWidth
              margin="normal"
              value={age}
              onChange={(e) => setAge(Math.min(Math.max(Number(e.target.value), 18), 65))}
              required
            />
            <InputLabel id="batch-label">Batch</InputLabel>
            <Select
              labelId="batch-label"
              id="batch-select"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              fullWidth
              label="Batch"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="6-7AM">6-7AM</MenuItem>
              <MenuItem value="7-8AM">7-8AM</MenuItem>
              <MenuItem value="8-9AM">8-9AM</MenuItem>
              <MenuItem value="5-6PM">5-6PM</MenuItem>
            </Select>
            <TextField
              label="Payment"
              variant="outlined"
              fullWidth
              margin="normal"
              value={payment}
              InputProps={{ readOnly: true }}
            />
            <Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: '1rem' }}>
              Note: Payment is due every month.
            </Typography>
            <Button variant="contained" color="primary" type="submit" fullWidth style={{ marginTop: '1rem' }}>
              Submit
            </Button>
          </form>
          {error && (
            <Typography variant="body2" color="error" align="center" style={{ marginTop: '1rem' }}>
              {error}
            </Typography>
          )}
          {paymentStatus && (
            <Typography variant="body2" color="success" align="center" style={{ marginTop: '1rem' }}>
              {paymentStatus}
            </Typography>
          )}
        </CardContent>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message="Form submitted successfully!"
        />
      </Card>
    </Container>
  );
}
 
export default App;