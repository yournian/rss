ps aux | grep rss.js | grep -v grep | cut -c 9-15 |xargs kill -9;
nohup node ./rss.js &
