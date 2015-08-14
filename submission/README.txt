1. Install NodeJS
sudo apt-get update
sudo apt-get install nodejs

2. Install npm, which is the Node.js package manager
sudo apt-get install npm

3. Install MongoDB on Ubuntu
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo apt-get install -y mongodb-org=2.6.1 mongodb-org-server=2.6.1 mongodb-org-shell=2.6.1 mongodb-org-mongos=2.6.1 mongodb-org-tools=2.6.1
sudo service mongod start

4. Install Express.js on Ubuntu
sudo apt-get install curl git
curl https://raw.github.com/creationix/nvm/master/install.sh | sh
npm install -g express

5. Install node Geocoder for geocoding API's
npm install node-geocoder

6. Install Node Async(Async is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript.)
npm install async

7. Install nodemon :
npm install -g nodemon

8. Import the entire csv file link onto mongodb by running this script:
gawk -F',' '{ \
    gsub(/, +/, ",", $0); \
    gsub(/\xC2/, "", $0); \
    printf("{_id:%d,name1:\"%s\",name2:\"%s\",name:\"%s\",street:\"%s\",city:\"%s\",state:\"%s\",pincode:\"%d\",phone:\"%s\"}}\n" ,$1,$2,$3,$4,$5,$6,$7,$8,$9)}' http://www.cs.cornell.edu/Courses/CS5412/2015sp/_cuonly/restaurants_all.csv \
  | mongoimport -d "cloud" -c "restaurants"

To run the app:
The entire server side logic can be found in the routes folder in "index.js" and the front end GUI can be found in the views folder in "index.hbs" 
Enter the src folder by "cd /src/bin/".
Run the web app by typing "nodemon www" on the terminal

