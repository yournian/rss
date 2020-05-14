ps aux | grep podcast.js | grep -v grep | cut -c 9-15 |xargs kill -9;
nohup node ./podcast.js &
