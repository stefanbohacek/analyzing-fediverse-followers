import fs from "fs";
import mastodon from "./modules/mastodon.js";
import sleep from "./modules/sleep.js";
import * as dotenv from "dotenv";
dotenv.config();

let endpoint = `accounts/lookup`;

const accounts = JSON.parse(fs.readFileSync('accounts.json', 'utf8'));

accounts.forEach(async (account) => {
  await sleep(1000);
  const userData = await mastodon(account.instance, endpoint, {
    acct: account.username,
  });

  if (userData?.id) {
    await sleep(1000);
    endpoint = `accounts/${userData.id}/followers`;
    const data = await mastodon(account.instance, endpoint);

    console.log(
      `found ${data.length.toLocaleString("en-US")} items, saving...`
    );

    const fileName = `${account.username}@${account.instance}`;

    fs.writeFileSync(`./data-full/${fileName}.json`, JSON.stringify({
      userData,
      data
    }), {
      encoding: "utf8",
    });
    console.log(`done`);
  }
});
