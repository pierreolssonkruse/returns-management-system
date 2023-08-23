import React, { useState, useEffect, useContext } from 'react';
import { ThemeProvider, createTheme, Button, TextField, CssBaseline } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DarkModeProvider from './DarkModeProvider';
import DarkThemeContext from './DarkThemeContext';
import './App.css';

import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50',
    },
  },
});

function DarkModeSwitcher() {
  const { darkMode, toggleDarkMode } = useContext(DarkThemeContext);
  return (
    <button onClick={toggleDarkMode}>
      {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    </button>
  );
}

function MainApp() {
  const [returns, setReturns] = useState([]);
  const [productName, setProductName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [reason, setReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReturn, setCurrentReturn] = useState(null);

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

  const handleUpdate = async (id, updatedReturn) => {
    try {
      const response = await axios.put(`http://localhost:5001/returns/${id}`, updatedReturn);
      const updatedReturns = returns.map(item => item._id === id ? response.data : item);
      setReturns(updatedReturns);
    } catch (error) {
      console.error("Error updating return", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/returns/${id}`);
      const remainingReturns = returns.filter(item => item._id !== id);
      setReturns(remainingReturns);
    } catch (error) {
      console.error("Error deleting return", error);
    }
  };

  const handleEdit = (item) => {
    setCurrentReturn(item);
    setIsModalOpen(true);
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
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
        <br />
        <Button type="submit" variant="contained" color="primary">
          Submit Return
        </Button>
      </form>
      {isModalOpen && (
        <div className="backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="edit-modal" onClick={e => e.stopPropagation()}>
            <h2>Edit Return</h2>
            <TextField
              value={currentReturn.productName}
              onChange={e => setCurrentReturn({ ...currentReturn, productName: e.target.value })}
              label="Product Name"
              variant="outlined"
              margin="normal"
            />
            <TextField
              value={currentReturn.customerId}
              onChange={e => setCurrentReturn({ ...currentReturn, customerId: e.target.value })}
              label="Customer ID"
              variant="outlined"
              margin="normal"
            />
            <TextField
              value={currentReturn.reason}
              onChange={e => setCurrentReturn({ ...currentReturn, reason: e.target.value })}
              label="Reason"
              variant="outlined"
              margin="normal"
              multiline
            />
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleUpdate(currentReturn._id, currentReturn);
                setIsModalOpen(false);
              }}
            >
              Save
            </Button>
            <Button
              variant="text"
              color="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Customer ID</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {returns.map(item => (
              <tr key={item._id}>
                <td>{item.productName}</td>
                <td>{item.customerId}</td>
                <td>{item.reason}</td>
                <td>{item.status}</td>
                <td>
                  <EditIcon
                    color="primary"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleEdit(item)}
                  />
                </td>
                <td>
                  <DeleteIcon
                    color="error"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleDelete(item._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <MainApp />
          <DarkModeSwitcher />
        </div>
      </ThemeProvider>
    </DarkModeProvider>
  );
}

export default App;