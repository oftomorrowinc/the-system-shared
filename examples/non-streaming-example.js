// Example of using the API client without streaming
// This example:
// 1. Creates a project with the PingPong workflow
// 2. Waits for a specified time
// 3. Fetches the results

// Import the shared SDK and load environment variables
const { ApiClient } = require('../dist/lib/api-client');
const config = require('./config');

// Sample project data using the PingPong workflow
const projectData = {
  name: 'PingPong Test',
  workflowId: 'sJIQqPRhULhyvZguFLzK', // PingPong workflow ID
  workflowVersion: 1,
  organizationId: 'org-123',
  owners: ['user-123'],
  inputValue: {
    PingPong: 'ping' // This will get responded to with "pong"
  },
  // No useStream option for non-streaming example
  webhookUrl: '' // Explicitly set to empty to skip the default in .env
};

// Sleep helper function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runExample() {
  try {
    // Create an API client with configuration
    const apiClient = new ApiClient({
      baseUrl: config.get('API_BASE_URL', 'https://us-central1-the-system-ai.cloudfunctions.net/'),
      apiKey: config.get('API_KEY'),
      webhookUrl: config.get('WEBHOOK_URL')
    });
    
    console.log('Creating project...');
    const result = await apiClient.createProject(projectData);
    const projectId = result.projectId;
    
    console.log(`Project created with ID: ${projectId}`);
    console.log('Waiting 60 seconds for processing...');
    
    // Wait for the project to complete processing
    await sleep(60000);
    
    console.log('Fetching project results...');
    const projectResults = await apiClient.getProjectResults(projectId);
    
    console.log('Project results:');
    console.log(JSON.stringify(projectResults, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the example
runExample();