db = db.getSiblingDB("openlifter");
db.createUser({
  user: "openlifter_api_user",
  pwd: "xaw!TNQ7cwp3fdr2cqf",
  roles: [{ role: "readWrite", db: "openlifter" }],
});
db.createCollection("order");
