# Getting Started with the Back End


# Node version requirement
### `node 14`

# Installing dependencies
run `npm install`.  
If problem encountered during installation, check the ff:  
* Check if your node version is correct
* Delete node_modules folder then run `npm install`

## Available Scripts

In the project directory, you can run:

### `node server.js`

Runs the app using port `4000` or it will take the port value that is saved in your process env.

### `nodemon server.js`

Same just like how `node server.js` works. The difference is that, every time you make a change on the code, it will automatically restart the server.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

Note: If the test fails due to execution timeout of tests, you can change the timeout value in the `jest.config.js` file.  

## Available Endpoints  
### Get List of Users
GET `localhost:4000/users`
#### Optinal query parameter
* page : number  

This will return pageable list of users. If page value is invalid (eg. asd), it will respond with status of bad request.  

### Get User by Id
GET `localhost:4000/users/:id`
#### Path Variable
* id : any value

This will return an object data of user using his id. If id doesn't exists, it will responed with error "User not found".  

### Create New User
POST `localhost:4000/user/create`
#### Request Body
```
{
    "name": "name",
    "job": "job"
}
```


This will save new user. If names is missing or have a blank value, it will responed with status bad request.

Note: Creating new user will not add to the list of users that Get Users endpoint returns. But it will still validate if name already exists. Additional information can be found commented on the code.

