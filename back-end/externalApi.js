const axios = require('axios');
const retry = require('retry');

const retryOptions = {
    retries: 3,         
    factor: 2,          
    minTimeout: 1000,   
    maxTimeout: 5000,   
    randomize: true,
};

async function makeHttpRequestWithRetry(url, method, data) {
    const operation = retry.operation(retryOptions);
  
    return new Promise((resolve, reject) => {
      operation.attempt(async (currentAttempt) => {
        try {
          let response;

          if (method === 'GET') {
            response = await axios.get(url);
          } 
          if (method === 'POST') {
            response = await axios.post(url, data);
          } 
          
          if (response.status === axios.HttpStatusCode.Ok 
                || response.status === axios.HttpStatusCode.Created) {
            resolve(response);
          } else {
            const error = new Error(`Unexpected error: ${response.status}`);
            reject(error);
          }
          
        } catch (error) {
          if (operation.retry(error)) {
            console.log(`Retrying after attempt ${currentAttempt}: ${error.message}`);
            return;
          }
  
          reject(error.response);
        }
      });
    });
  }

async function getUserList(page) {
     return await makeHttpRequestWithRetry(`https://reqres.in/api/users${page ? `?page=${page}` : ''}`, 'GET')
}

async function getUserById(id) {
    const response = await makeHttpRequestWithRetry(`https://reqres.in/api/users/${id}`, 'GET')
    return response.data
}

async function createNewUser(payload) {
    const response = await makeHttpRequestWithRetry('https://reqres.in/api/users', 'POST', payload)
    return response.data
}

module.exports = { getUserList, getUserById, createNewUser }