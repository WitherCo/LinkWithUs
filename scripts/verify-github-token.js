import https from 'https';

// Get the GitHub token from environment variables
const token = process.env.GITHUB_TOKEN;

if (!token) {
  console.error('Error: GITHUB_TOKEN environment variable is not set');
  process.exit(1);
}

// Make a request to the GitHub API to verify the token
const options = {
  hostname: 'api.github.com',
  path: '/user',
  method: 'GET',
  headers: {
    'User-Agent': 'Node.js GitHub Token Verification',
    'Authorization': `token ${token}`
  }
};

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      const userData = JSON.parse(data);
      console.log(`GitHub token is valid for user: ${userData.login}`);
      console.log('Token has sufficient permissions to access GitHub API');
    } else {
      console.error(`Error: GitHub API returned status code ${res.statusCode}`);
      console.error(`Message: ${data}`);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('Error making request to GitHub API:', error.message);
  process.exit(1);
});

req.end();