const axios = require('axios');

const api = axios.create({
  baseURL: 'https://mcapi.us/server/status?ip=aftergang.cloud', 
});

module.exports = api;