// Example of using the API client with streaming
// This example:
// 1. Creates a project with the PingPong workflow with streaming enabled
// 2. Processes stream data events as they arrive

// Import the shared SDK and load environment variables
const { ApiClient } = require('../dist/lib/api-client');
const config = require('./config');

// Sample project data using the PingPong workflow
const projectData = {
  name: 'PingPong Test (Streaming)',
  workflowId: 'sJIQqPRhULhyvZguFLzK', // PingPong workflow ID
  workflowVersion: 1,
  organizationId: 'org-123',
  owners: ['user-123'],
  inputValue: {
    PingPong: 'ping' // This will get responded to with "pong"
  },
  useStream: true, // Enable streaming for this request
  webhookUrl: '' // Explicitly set to empty to skip the default in .env
};

async function runExample() {
  try {
    // Create an API client with configuration
    const apiClient = new ApiClient({
      baseUrl: config.get('API_BASE_URL', 'https://us-central1-the-system-ai.cloudfunctions.net/'),
      apiKey: config.get('API_KEY'),
      webhookUrl: config.get('WEBHOOK_URL')
    });
    
    console.log('Creating project with streaming...');
    
    // Define a callback function to process stream data
    const handleStreamData = (data) => {
      console.log('Stream data received:');
      
      if (data.type === 'raw') {
        // Handle raw text response
        console.log(`Raw output: ${data.text}`);
      } else if (data.type === 'error') {
        // Handle error response
        console.error(`Stream error: ${data.error || data.message || 'Unknown error'}`);
      } else {
        // Handle structured JSON response
        console.log(JSON.stringify(data, null, 2));
        
        // Process known event types
        if (data.type === 'project_update') {
          console.log(`Project update: ${data.status}`);
        } else if (data.type === 'completion') {
          console.log('Project completed!');
        }
      }
      
      // Output a separator for readability
      console.log('-'.repeat(40));
    };
    
    // Start the streaming project
    // When using streaming, we don't get a projectId returned directly
    // Instead, the project updates come through the stream
    await apiClient.createProject(projectData, handleStreamData);
    
    console.log('Stream processing complete');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the example
runExample();