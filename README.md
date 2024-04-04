# Analyzing fediverse followers (with Mastodon API)

This is a collection of quick and dirty scripts I used in [my article where I analyzed followers](https://stefanbohacek.com/blog/analyzing-fediverse-followers/) of my [creative bots](https://stefans-creative-bots.glitch.me/).


## How to use

1. Create a new Mastodon app and retrieve your API token. ([This tutorial](https://botwiki.org/resource/tutorial/how-to-make-a-mastodon-botsin-space-app-bot/) shows you how.)
2. Make a copy of `.env-example` and save your API token here.
3. Update the `accounts.json` file with a list of accounts you want to analyze.
4. Assuming you already have [node](https://nodejs.org/en/download/current) installed, install the project's dependencies:

```sh
npm install
```

5. Run the `download` and `analyze` scripts. 

```sh
# the "download" script saves the full account and follower data into the data-full folder
npm run download

# the "analyze" script transforms the downloaded data and anonymizes follower information
npm run analyze
```

6. Use your preferred language to run a simple HTTP server to host the `index.html` file. Here are some examples:

```sh
php -S localhost:8080
```

```sh
python -m http.server --bind localhost
```

```sh
npm install http-server -g
http-server
```

This file renders a simple page with two charts made with [Apache ECharts](https://echarts.apache.org/examples/en/index.html).
