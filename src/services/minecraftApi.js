const axios = require('axios');


const api = axios.create({
  baseURL: 'https://mcapi.us/server/status?ip=81.84.138.90:25590', 
});

module.exports = api;