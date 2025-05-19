// Simple config loader for examples
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '.env');

    if (!fs.existsSync(envPath)) {
      console.warn(`Warning: .env file not found at ${envPath}`);
      console.warn('Create one by copying .env.example to .env');
      return {};
    }

    console.log(`Loading environment from: ${envPath}`);
    const envContent = fs.readFileSync(envPath, 'utf8');

    // Parse .env file
    const envVars = envContent
      .split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .reduce((acc, line) => {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();
        if (key && value) {
          const trimmedKey = key.trim();
          acc[trimmedKey] = value;
          console.log(
            `Loaded env var: ${trimmedKey}=${value.length > 20 ? value.substring(0, 20) + '...' : value}`
          );
        }
        return acc;
      }, {});

    // Set environment variables
    Object.assign(process.env, envVars);

    return envVars;
  } catch (error) {
    console.warn('Warning: Error parsing .env file:', error.message);
    console.warn('Create one by copying .env.example to .env');
    return {};
  }
}

// Load env vars when this module is imported
const loadedVars = loadEnv();

// Export a helper to get specific env vars with defaults
module.exports = {
  get: (key, defaultValue = undefined) => {
    const value = process.env[key] || defaultValue;
    // Only log when the value isn't a secret (like API keys)
    if (!key.includes('KEY') && !key.includes('SECRET')) {
      if (value === defaultValue && defaultValue !== undefined) {
        console.log(`Using default value for ${key}: ${defaultValue}`);
      } else if (value === undefined) {
        console.log(`Warning: ${key} is undefined and no default provided`);
      }
    }
    return value;
  },
};
