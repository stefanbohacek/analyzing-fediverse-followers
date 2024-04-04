import fs from "fs";
import crypto from "crypto";

const myAccounts = [
  "stefan@stefanbohacek.online",
  "stefanbohacek@calckey.social",
  "stefan@misskey.id",
];

let bots = [];
let allFollowers = {};
let uniqueFollowers = new Set();

fs.readdirSync("data-full").forEach((file) => {
  if (file.endsWith(".json")) {
    console.log(`reading ${file}...`);

    const data = JSON.parse(
      fs.readFileSync("data-full/" + file, { encoding: "utf8" })
    );

    const followers = data.data.filter(
      (follower) => !myAccounts.includes(follower.acct)
    );
    const botData = data.userData;

    followers.forEach((follower) => {
      if (allFollowers[follower.acct]) {
        allFollowers[follower.acct]++;
      } else {
        allFollowers[follower.acct] = 1;
      }
      console.log(follower.acct);
    });

    const bot = {
      name: file.replace(".json", ""),
      created_at: botData.created_at,
      url: botData.url,
      avatar: botData.avatar,
      statuses_count: botData.statuses_count,
      followers_count: followers.length,
      followers: followers.map((follower) =>
        crypto.createHash("md5").update(follower.acct).digest("hex")
      ),
    };

    console.log(
      `${bot.name} has ${bot.followers.length.toLocaleString()} followers...`
    );

    // bot.followers = bot.followers.length;
    bots.push(bot);

    followers.forEach((follower) => {
      // console.log(follower);
      // console.log(follower.acct);
      uniqueFollowers.add(follower.acct);
    });
  }
});

const allFollowersArray = [];

for (let follower in allFollowers) {
  allFollowersArray.push({
    // id: follower,
    id: crypto.createHash("md5").update(follower).digest("hex"),
    follows: allFollowers[follower],
  });
}

allFollowersArray.sort((a, b) => b.follows - a.follows);
bots.sort((a, b) => b.followers.length - a.followers.length);

console.log(bots);
console.log(allFollowersArray);
// console.log(uniqueFollowers);

console.log(
  `found ${allFollowersArray.length.toLocaleString()} unique followers`
);

fs.writeFileSync("data/bots.json", JSON.stringify(bots, null, 2), "utf8");
fs.writeFileSync(
  "data/followers.json",
  JSON.stringify(allFollowersArray, null, 2),
  "utf8"
);
