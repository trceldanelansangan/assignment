const request = require('supertest');
const app = require('./app')

describe('GET /users', () => {
    it('validates get user list with invalid page value', async () => {
        const response = await request(app)
        .get('/users?page=invalid')
        .expect('Content-Type', /json/)
        .expect(400);

        expect(response.body).toEqual({ errorMessage: "Invalid type for value of page" });
    })

    it('responds with json containing list of users', async () => {
        const response = await request(app)
            .get('/users')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data[0].first_name).toEqual("George");

        const responseP2 = await request(app)
            .get('/users?page=2')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(responseP2.body.data[0].first_name).toEqual("Michael");

        const response3 = await request(app)
            .get('/users?page=2')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response3.body.data[0].first_name).toEqual("Michael");
    })
})

describe('GET /users/:id', () => {
    it('responds with user data', async () => {
        const response = await request(app)
        .get('/users/1')
        .expect('Content-Type', /json/)
        .expect(200);

        expect(response.body.id).toEqual(1);
        expect(response.body.first_name).toEqual("George");
    })

    it('responds with user not found', async () => {
        const response = await request(app)
        .get('/users/123')
        .expect('Content-Type', /json/)
        .expect(404);

        expect(response.body.errorMessage).toEqual("User not found");
    })
})

describe('POST /user/create', () => {
    it('responds with user data if successfuly created', async () => {
        const response = await request(app)
        .post('/user/create')
        .send({ name: "james", job: "dev"})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

        expect(response.body.name).toEqual("james");
        expect(response.body.job).toEqual("dev");
    })

    it('validate when name is empty or already exists', async () => {
        const response = await request(app)
        .post('/user/create')
        .send({ name: "james2", job: "dev"})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

        expect(response.body.name).toEqual("james2");
        expect(response.body.job).toEqual("dev");

        const userExist = await request(app)
        .post('/user/create')
        .send({ name: "james2", job: "dev"})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400);

        expect(userExist.body.errorMessage).toEqual("Name already exists")

        const nameIsMissing = await request(app)
        .post('/user/create')
        .send({ name: "", job: "dev"})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400);

        expect(nameIsMissing.body.errorMessage).toEqual("Name is required")
    })
})
