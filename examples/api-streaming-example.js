// Example of using the API client with streaming
// This example:
// 1. Creates a project with the PingPong workflow with streaming enabled
// 2. Processes stream data events as they arrive

// Import the shared SDK and load environment variables
const { ApiClient } = require('../dist/lib/api-client');
const config = require('./config');

// Generate a timestamp for unique project names
const timestamp = Date.now();

// Sample project data using the PingPong workflow
const projectData = {
  name: `PingPong Test (Streaming) ${timestamp}`,
  workflowId: 'sJIQqPRhULhyvZguFLzK', // PingPong workflow ID
  workflowVersion: 1,
  organizationId: 'org-123',
  owners: ['user-123'],
  inputValue: {
    PingPong: 'ping', // This will get responded to with "pong"
  },
  useStream: true, // Enable streaming for this request
  webhookUrl: '', // Empty string will be handled by removing the property entirely
};

// Debug function to print API information
function printDebugInfo(apiConfig, projectRequest) {
  console.log('\n======== API DEBUG INFORMATION ========');
  console.log(`API Base URL: ${apiConfig.baseUrl}`);
  console.log(`Using API Key: ${apiConfig.apiKey ? 'Yes' : 'No'}`);

  console.log('\n======== PROJECT REQUEST PAYLOAD ========');
  console.log(JSON.stringify(projectRequest, null, 2));
  console.log('\n==========================================');
}

async function runExample() {
  try {
    // Create an API client with configuration
    const apiClient = new ApiClient({
      baseUrl: config.get('API_BASE_URL', 'https://us-central1-the-system-ai.cloudfunctions.net/'),
      apiKey: config.get('API_KEY'),
      webhookUrl: config.get('WEBHOOK_URL'),
    });

    console.log('Creating project with streaming...');
    console.log(`Project name: ${projectData.name}`);

    // Print debug information
    printDebugInfo(
      {
        baseUrl: config.get(
          'API_BASE_URL',
          'https://us-central1-the-system-ai.cloudfunctions.net/'
        ),
        apiKey: config.get('API_KEY') ? '********' : undefined,
      },
      projectData
    );

    // Define a callback function to process stream data
    const handleStreamData = data => {
      console.log('Stream data received:');

      if (data.type === 'raw') {
        // Handle raw text response
        console.log(`Raw output: ${data.text}`);
      } else if (data.type === 'error') {
        // Handle error response
        console.error(`Stream error: ${data.error || data.message || 'Unknown error'}`);

        // Check for specific error types that might need additional handling
        if (data.error && data.error.includes('Failed to create')) {
          console.log(
            'NOTE: This error might be due to incorrect API credentials or server issues.'
          );
          console.log('      Check your API key and base URL in the .env file.');

          // Additional debugging for common issues
          if (!config.get('API_KEY')) {
            console.log('\n⚠️ WARNING: No API key found in .env file!');
            console.log('Make sure you have copied .env.example to .env and set API_KEY value.\n');
          }

          const baseUrl = config.get('API_BASE_URL', '');
          if (!baseUrl.includes('the-system-ai') && !baseUrl.includes('cloudfunctions')) {
            console.log('\n⚠️ WARNING: The API_BASE_URL in your .env file may be incorrect!');
            console.log('Expected format: https://us-central1-the-system-ai.cloudfunctions.net/\n');
          }
        }
      } else {
        // Handle structured JSON response
        console.log(JSON.stringify(data, null, 2));

        // Process known event types
        if (data.type === 'project_created') {
          console.log(`Project created with ID: ${data.projectId}`);
        } else if (data.type === 'project_update') {
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
    console.log('\nTROUBLESHOOTING:');
    console.log('1. Check your .env file for correct API_KEY and API_BASE_URL');
    console.log('2. Make sure your API key has permission to access the workflow');
    console.log('3. Check that the workflowId exists and is accessible');
    console.log('4. Ensure your network connection to the API server is working');
    console.log('\nCONFIGURATION STATUS:');
    console.log(`API Key present: ${config.get('API_KEY') ? 'Yes' : 'No'}`);
    console.log(`API Base URL: ${config.get('API_BASE_URL', 'Not set')}`);
  }
}

// Run the example
runExample();
