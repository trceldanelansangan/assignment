const express = require('express');
const axios = require('axios');
const cors = require('cors');
const retry = require('retry');
const Cache = require('./Cache')
const { getUserList, getUserById, createNewUser } = require('./externalApi')

const app = express();
const userCache = new Cache();
app.use(express.json());
app.use(cors());


// Storage of newly added user since the endpoint for adding new user on the 
// reqres api is not actually adding the created user to the user list.
// This will be cleared when the server restarts.
const userLists = []

const ONE_MINUTE_TIME = 60000

app.get('/users', async (req, res) => {

    const { page } = req.query

    if (page && isNaN(parseInt(page))) {
        res.status(400).json({
            errorMessage: 'Invalid type for value of page'
        })
    } else {
        const cacheId = `users-page${page || 1}`

        const usersListCachedData = userCache.getCache(cacheId)

        if (usersListCachedData) {
            res.json(usersListCachedData)
        } else {
            try {
                const response = await getUserList(page);
                userCache.setCache(cacheId, response.data, 2 * ONE_MINUTE_TIME)
                res.json(response.data);
            } catch(error) {
                const { status, statusText } = error
                console.log('Failed to fetch list of users.', status, statusText)
                res.status(status).json({ errorMessage: statusText })
            }
        }
    }
})

app.get('/users/:id', async (req, res) => {

    const { id } = req.params
    const cacheId = `user${id}`
    const userCachedData = userCache.getCache(cacheId)

    if (userCachedData) {
        userCache.setCache(cacheId, userCachedData, 5 * ONE_MINUTE_TIME)
        res.json(userCachedData);
    } else {
        try {
            const response = await getUserById(id)
            userCache.setCache(cacheId, response.data, 5 * ONE_MINUTE_TIME)
            res.json(response.data);
        } catch (error) {
            const { status, statusText } = error
            console.log(`Failed to fetch user with id : ${id}.`, status, statusText)
            res.status(status).json({ errorMessage: status === 404 ? 'User not found' : statusText })
        }
    }
})

// Didn't implement caching here for the reason that caching is generally used for retrieving data
// and can't find any use of caching the response from newly created user
app.post('/user/create', async (req, res) => {

    const payload = req.body

    if (payload.name.trim().length === 0) {
        res.status(400).json({
            errorMessage: 'Name is required'
        })
    } else if (userLists.find(user => user.name.toLowerCase() === payload.name.toLowerCase())) {
        res.status(400).json({
            errorMessage: 'Name already exists'
        })
    } else {
        try {
            const response = await createNewUser(payload)
            
            const newUser = {
                id: Number(response.id),
                name: response.name,
                job: response.job
            }
    
            userLists.push(newUser)
    
            res.json(response)
    
        } catch (error) {
            const { status, statusText } = error
            console.log(`Failed to create user with name: ${payload.name}.`, status, statusText)
            res.status(status).json({ errorMessage: statusText })
        }
    }
})

module.exports = app;