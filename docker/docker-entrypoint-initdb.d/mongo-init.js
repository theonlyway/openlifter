db = db.getSiblingDB("openlifter");
db.createUser({
  user: "api_user",
  pwd: "xaw!TNQ7cwp3fdr2cqf",
  roles: [{ role: "readWrite", db: "openlifter" }],
});
db.createCollection("lifters");
