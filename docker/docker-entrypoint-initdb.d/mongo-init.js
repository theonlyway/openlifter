db = db.getSiblingDB("openlifter");
db.createUser({
  user: "api_user",
  pwd: "api1234",
  roles: [{ role: "readWrite", db: "openlifter" }],
});
db.createCollection("lifters");
