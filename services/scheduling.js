const config = require("../config/config");
const Agenda = require("agenda");
const Task = require("../models/task.model");
const agenda = new Agenda({
  db: {
    address: config.mongoose.url,
    // processEvery: "10 seconds",
    // options: { useUnifiedTopology: true },
  },
});

agenda.define("expired task", async (job) => {
  console.log("expired task");
  await Task.updateMany(
    { $and: [{ expire: { $lte: new Date() } }, { status: { $eq: 0 } }] },
    { $set: { status: 2 } }
  );
  done();
});

agenda.on("ready", async () => {
  console.log("connected");
});

(async function () {
  // IIFE to give access to async/await
  await agenda.start();

  // await agenda.schedule("in 10 seconds", "expired task");
  await agenda.every("1 days", "expired task", null, { timezone: 'Asia/Shanghai'});
})();
