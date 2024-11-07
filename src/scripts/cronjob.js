const { CronJob } = require("cron");

const cronUrl =
  process.env.ENViRONMENT === "prod"
    ? "https://bendi.onrender.com/cronjob"
    : "http://localhost:3056/cronjob";

const job = new CronJob(
  "0 */12 * * * *", // cronTime
  async function () {
    const response = await fetch(cronUrl);
    const data = await response.json();
    console.log(data);
  }, // onTick
  null, // onComplete
  true, // start
  "Asia/Ho_Chi_Minh" // timeZone
);

module.exports = job;
