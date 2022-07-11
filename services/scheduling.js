const config = require("../config/config");
const Agenda = require("agenda");
const Task = require("../models/task.model");
const agenda = new Agenda({ db: { address: config.mongoose.url } });

agenda.define("expired task", async (job) => {
  await Task.findByIdAndUpdate(
    { endTime: { $lte: new Date() } },
    { status: 2 }
  );
});

(async function () {
  // IIFE to give access to async/await
  await agenda.start();

  await agenda.every("1 days", "expired task");
})();
