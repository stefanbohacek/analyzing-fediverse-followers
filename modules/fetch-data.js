import fs from 'fs';
import mastodon from './mastodon.js';

const fetchData = async (datasets) => {
  for (let accountGroup of datasets ){
    let accountGroupAll = [], followersIDs = [], unfollowers = [];

    if (accountGroup === 'followers'){
      console.log(`loading saved ${accountGroup}...`);

      if (fs.existsSync(`./data/${accountGroup}-all.json`)){
        accountGroupAll = JSON.parse(fs.readFileSync(`./data/${accountGroup}-all.json`, 'utf8'));
      }
    }

    console.log(`fetching ${accountGroup}...`);
    
    let data = await mastodon(`accounts/${process.env.MASTODON_USER_ID}/${accountGroup}`);
    // console.log({data});

    data = data.sort(function(a, b) {
      if (a.followers_count > b.followers_count) return -1;
      if (a.followers_count < b.followers_count) return 1;
      return 0;
    });

    console.log(`found ${data.length} ${accountGroup}, processing...`);
    
    let accounts = [], accountIDs = [], ids = [];

    for (let account of data){
      // const familiar_followers  = await mastodon(`accounts/familiar_followers `, {
      //     id: [account.id]
      // });

      accounts.push({
        id: account.id,
        username: account.username,
        acct: account.acct,
        display_name: account.display_name,
        // relationships,
        // familiar_followers,
        bot: account.bot,
        note: account.note,
        url: account.url,
        avatar_static: account.avatar_static,
        header_static: account.header_static,
        followers_count: account.followers_count || 0,
        following_count: account.following_count || 0,
        last_status_at  : account.last_status_at,
      });

      ids.push(account.id);
      accountIDs.push(account.acct);
    }

    if (accountGroup === 'following'){
      const relationships = await mastodon(`accounts/relationships`, {
          id: ids
      });

      accounts = accounts.map(t1 => ({...t1, ...relationships.find(t2 => t2.id === t1.id)}))

      // console.log({
      //     'found accounts': accounts.length,
      //     // relationships
      //     // accounts
      // });
    }

    // console.log(`found ${accounts.length} ${accountGroup}`);

    fs.writeFileSync(`./data/${accountGroup}.json`, JSON.stringify(accounts), 'utf8');

    if (accountGroup === 'followers'){
      followersIDs = accounts.map(account => account.acct);

      let savedUnfollowers = [];

      if (fs.existsSync(`./data/unfollowers.json`)){
        savedUnfollowers = JSON.parse(fs.readFileSync(`./data/unfollowers.json`, 'utf8'));
      }

      const savedUnfollowersAccounts = savedUnfollowers.map(unfollower => unfollower.acct);
      // console.log({savedUnfollowersAccounts});

      const newUnfollowers = accountGroupAll.filter(account => {
        return savedUnfollowersAccounts.indexOf(account.acct) === -1 && followersIDs.indexOf(account.acct) === -1;
      }).reverse();

      unfollowers = newUnfollowers.concat(savedUnfollowers); 
      
      console.log(`found ${newUnfollowers.length} new unfollower(s)`);
      
      accountGroupAll = accountGroupAll.concat(accounts).filter((value, index, self) =>
        index === self.findIndex((t) => (t.acct === value.acct))
      );

      fs.writeFileSync(`./data/${accountGroup}-all.json`, JSON.stringify(accountGroupAll), 'utf8');        
      fs.writeFileSync(`./data/unfollowers.json`, JSON.stringify(unfollowers), 'utf8');        
    }
  }  
};

export default fetchData;
