// Simple config loader for examples
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Parse .env file
    const envVars = envContent
      .split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .reduce((acc, line) => {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();
        if (key && value) {
          acc[key.trim()] = value;
        }
        return acc;
      }, {});
    
    // Set environment variables
    Object.assign(process.env, envVars);
    
    return envVars;
  } catch (error) {
    console.warn('Warning: .env file not found or could not be parsed.');
    console.warn('Create one by copying .env.example to .env');
    return {};
  }
}

// Load env vars when this module is imported
loadEnv();

// Export a helper to get specific env vars with defaults
module.exports = {
  get: (key, defaultValue = undefined) => process.env[key] || defaultValue
};