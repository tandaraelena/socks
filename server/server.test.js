const request = require('supertest');
const main = require('./index');

afterAll((done) => {
  main.server.close();
  done();
});

describe("app tests",() => {
  test("should respond with a 200 status code", async () => {
    const response = await request(main.app).post("/emailEvents").send({
      "eventName": "websiteSignup",
      "userEmail": "notARealEmail@healthtech1.uk"
    });
    expect(response.statusCode).toBe(200);
  });
  
  test("should return a validation error for eventName", async () => {
    const response = await request(main.app).post("/emailEvents").send(  {
      "userEmail": "notARealEmail@healthtech1.uk"
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("eventName is required!");
  });
  
  test("should return a validation error for userEmail", async () => {
    const response = await request(main.app).post("/emailEvents").send({
      "eventName": "websiteSignup",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("userEmail is required!");
  });

  test("should return a validation error for unexistent flow trigger", async () => {
    const response = await request(main.app).post("/emailEvents").send({
      "eventName": "test",
      "userEmail": "notARealEmail@healthtech1.uk"
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("A flow for the provided eventName doesn't exist");
  });

  test("should return a valid response", async () => {
    const response = await request(main.app).post("/emailEvents").send({
      "eventName": "socksPurchased",
      "userEmail": "notARealEmail@healthtech1.uk"
    });
    expect(response.body).toBeDefined();
  });
})
