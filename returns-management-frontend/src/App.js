import React, { useState, useEffect, useContext } from 'react';
import { ThemeProvider, createTheme, Button, TextField, CssBaseline, Select, MenuItem, AppBar, Toolbar, IconButton, Menu, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DarkModeProvider from './DarkModeProvider';
import DarkThemeContext from './DarkThemeContext';
import SimpleBarChart from './SimpleBarChart';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import './App.css';

import axios from 'axios';

function DarkModeSwitcher() {
  const { darkMode, toggleDarkMode } = useContext(DarkThemeContext);
  return (
    <button onClick={toggleDarkMode}>
      {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </button>
  );
}

function MainApp() {
  const [returns, setReturns] = useState([]);
  const [filteredReturns, setFilteredReturns] = useState([]);
  const [data, setData] = useState([]);
  const [newData, setDateChartData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('none');
  const [productName, setProductName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [reason, setReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReturn, setCurrentReturn] = useState(null);

  useEffect(() => {
    async function fetchReturns() {
      const response = await axios.get('http://localhost:5001/returns');
      setReturns(response.data);
      const dateCounts = response.data.reduce((acc, curr) => {
        const date = new Date(curr.date).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const newData = Object.keys(dateCounts).map(date => ({
        date,
        count: dateCounts[date],
      }));
      setDateChartData(newData);
    }
    fetchReturns();
  }, []);

  useEffect(() => {
    setFilteredReturns(
      returns.filter((item) =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, returns]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/returns');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  const dateCounts = returns.reduce((acc, curr) => {
    const date = new Date(curr.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const dateChartData = Object.keys(dateCounts).map(date => ({
    date,
    count: dateCounts[date],
  }));


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newReturn = { productName, customerId, reason };
    const response = await axios.post('http://localhost:5001/returns', newReturn);
    setReturns([...returns, response.data]);
    setProductName("");
    setCustomerId("");
    setReason("");
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = (item) => {
    setCurrentReturn(item);
    setIsModalOpen(true);
  };

  let sortedReturns = [...filteredReturns];

  switch (sortOrder) {
    case 'productNameAsc':
      sortedReturns.sort((a, b) => a.productName.localeCompare(b.productName));
      break;
    case 'productNameDesc':
      sortedReturns.sort((a, b) => b.productName.localeCompare(a.productName));
      break;
    case 'customerIdAsc':
      sortedReturns.sort((a, b) => a.customerId - b.customerId);
      break;
    case 'customerIdDesc':
      sortedReturns.sort((a, b) => b.customerId - a.customerId);
      break;
    default:
      sortedReturns = filteredReturns;
  }

  return (
    <div className="App">
      <TextField
        id="search"
        value={searchTerm}
        onChange={handleSearchChange}
        label="Search by Product Name"
        variant="outlined"
        margin="normal"
      />
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
      <br />
      <Select
        value={sortOrder}
        onChange={e => setSortOrder(e.target.value)}
        variant="outlined"
        margin="normal"
        autoWidth
      >
        <MenuItem value="none">None</MenuItem>
        <MenuItem value="productNameAsc">Product Name (A-Z)</MenuItem>
        <MenuItem value="productNameDesc">Product Name (Z-A)</MenuItem>
        <MenuItem value="customerIdAsc">Customer ID (Low to High)</MenuItem>
        <MenuItem value="customerIdDesc">Customer ID (High to Low)</MenuItem>
      </Select>
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
            {sortedReturns.map(item => (
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
      <SimpleBarChart data={dateChartData} dataKey="date" />
    </div>
  );

}

function App() {
  const { darkMode } = useContext(DarkThemeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#4caf50',
      },
    },
  });

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <DarkModeProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Item 1</MenuItem>
              <MenuItem onClick={handleClose}>Item 2</MenuItem>
              <MenuItem onClick={handleClose}>Item 3</MenuItem>
            </Menu>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Returns Management System
            </Typography>
            <DarkModeSwitcher />
          </Toolbar>
        </AppBar>
        <div className="App">
          <MainApp />
        </div>
      </ThemeProvider>
    </DarkModeProvider>
  );
}

export default App;