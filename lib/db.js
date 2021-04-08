import AWS from "aws-sdk";

// Update AWS config using my user created in IAM service
AWS.config.update({
  accessKeyId: process.env.REACT_APP_DB_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_DB_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_DB_REGION,
});

// Create DynamoDB service object
const db = new AWS.DynamoDB.DocumentClient({
    apiVersion: "latest"
});

export default db;
