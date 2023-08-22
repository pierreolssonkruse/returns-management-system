import React, { useState, useEffect } from 'react';
//import Button from '@mui/material/Button';
//import { ThemeProvider, createTheme } from '@mui/material/styles'
import { ThemeProvider, createTheme, Button, TextField, CssBaseline } from '@mui/material';
//import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50',
    },
  },
});

function App() {
  const [returns, setReturns] = useState([]);
  const [productName, setProductName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    async function fetchReturns() {
      const response = await axios.get('http://localhost:5001/returns');
      setReturns(response.data);
    }
    fetchReturns();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newReturn = { productName, customerId, reason };
    const response = await axios.post('http://localhost:5001/returns', newReturn);
    setReturns([...returns, response.data]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <form onSubmit={handleSubmit}>
          {/* <input value={productName} onChange={e => setProductName(e.target.value)} placeholder="Product Name" />
          <input value={customerId} onChange={e => setCustomerId(e.target.value)} placeholder="Customer ID" /> */}
          <TextField 
            id="outlined-basic"
            value={productName} 
            onChange={e => setProductName(e.target.value)} 
            label="Product Name" 
            variant="outlined"
            margin="normal"
          />
          <TextField 
            id="outlined-basic"
            value={customerId} 
            onChange={e => setCustomerId(e.target.value)} 
            label="Customer ID" 
            variant="outlined"
            margin="normal"
          />
          <TextField 
            id="outlined-basic"
            value={reason} 
            onChange={e => setReason(e.target.value)} 
            label="Reason for return" 
            variant="outlined"
            margin="normal"
            multiline
          />
          {/* <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason for return"></textarea> */}
          {/* <button type="submit">Submit</button> */}
          <Button type="submit" variant="contained" color="primary">
            Submit Return
          </Button>
        </form>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Customer ID</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {returns.map(item => (
              <tr key={item._id}>
                <td>{item.productName}</td>
                <td>{item.customerId}</td>
                <td>{item.reason}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ThemeProvider>
  );
}

export default App;
