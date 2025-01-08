const url = `https://raw.githubusercontent.com/Xiija/FakeDB/master/db.json?token=${process.env.GITHUB_PRIVATE_TOKEN}`;

let tm = new Date().getTime();
const myRequest = new Request(url + '?time=' + tm, {
  method: 'GET',
  rejectUnauthorized: false, 
  insecureHTTPParser: true,
  mode: 'cors',
  cache: 'default',
});

fetch(myRequest).then(r => r.json()).then(r => console.log(r))