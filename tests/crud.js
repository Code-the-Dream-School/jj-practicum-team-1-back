const app = require("../src/app");
const { seed_db, testUserPassword } = require("./seed_db");
const get_chai = require("./get_chai");
const Plant = require("../src/models/Plant");

describe("API Plant CRUD Tests", function () {
  before(async function () {
    const { request } = await get_chai();

    
    this.testUser = await seed_db();

    
    const res = await request
      .execute(app)
      .post("/api/v1/auth/login")
      .send({ email: this.testUser.email, password: testUserPassword });

    this.token = res.body.token;

    
    const existingPlant = await Plant.findOne({ createdBy: this.testUser._id });
    this.existingPlantId = existingPlant?._id?.toString() || null;
  });

  it("should get list of plants", async function () {
    const { expect, request } = await get_chai();

    const res = await request
      .execute(app)
      .get("/api/v1/plants")
      .set("Authorization", `Bearer ${this.token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("plants");
    expect(res.body.plants).to.be.an("array");
  });

  it("should create a new plant", async function () {
    const { expect, request } = await get_chai();

    const newPlant = {
      name: "Fiddle Leaf Fig",
      imageURL: "https://example.com/plant.jpg",
      notes: "Needs indirect sunlight",
      location: "Living Room",
    };

    const res = await request
      .execute(app)
      .post("/api/v1/plants")
      .set("Authorization", `Bearer ${this.token}`)
      .send(newPlant);

    console.log("Response status:", res.status);
    console.log("Response body:", res.body);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property("plant");
    expect(res.body.plant).to.include({
      name: newPlant.name,
      imageURL: newPlant.imageURL,
      notes: newPlant.notes,
      location: newPlant.location,
    });

    const plantInDb = await Plant.findOne({ name: newPlant.name });
    expect(plantInDb).to.not.be.null;
  });
});
