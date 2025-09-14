// tests/login_api.js
const app = require("../src/app");
const get_chai = require("./get_chai");
const User = require("../src/models/Auth");
const faker = require("@faker-js/faker").fakerEN_US;
const Plant = require("../src/models/Plant");


describe("API Login and Access Protected Route", function () {
  let email, password, token;

  before(async () => {
    email = faker.internet.email();
    password = faker.internet.password();

    await User.create({ name: "Test User", email, password });
  });

  it("should log in the user and return a JWT", async () => {
    const { expect, request } = await get_chai();

    const res = await request
      .execute(app)
      .post("/api/v1/auth/login")
      .set("Content-Type", "application/json")
      .send({ email, password });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("token").that.is.a("string");
    expect(res.body).to.have.property("user");
    expect(res.body.user).to.have.property("name", "Test User");
    expect(res.body.user).to.have.property("userId");

    token = res.body.token;
  });
  it("should create a new plant using the token", async () => {
    const { expect, request } = await get_chai();

    const newPlant = {
      name: "Aloe Vera",
      imageURL: "https://example.com/aloe.jpg",
      notes: "Water once a week",
      location: "Kitchen",
    };

    const res = await request
      .execute(app)
      .post("/api/v1/plants")
      .set("Authorization", `Bearer ${token}`)
      .send(newPlant);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property("plant");
    expect(res.body.plant).to.include({
      name: newPlant.name,
      imageURL: newPlant.imageURL,
      notes: newPlant.notes,
      location: newPlant.location,
    });

    const plantInDb = await Plant.findOne({
      name: newPlant.name,
    });
    expect(plantInDb).to.not.be.null;
  });

  it("should access the /api/v1/plants route and list plants", async () => {
    const { expect, request } = await get_chai();

    const res = await request
      .execute(app)
      .get("/api/v1/plants")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("plants").that.is.an("array");
  });
});
