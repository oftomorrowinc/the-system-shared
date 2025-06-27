// Example of using the API client with webhooks and custom steps workflow
// This example:
// 1. Sets up a webhook server to receive project updates
// 2. Creates a project with custom steps instead of a predefined workflow
// 3. Receives webhook notifications when the project completes
// 4. Fetches the final results automatically when completed

// Import the shared SDK
const { ApiClient } = require('../dist');
const config = require('./config');

// Generate a timestamp for unique project names
const timestamp = Date.now();

// Sample project data using custom steps with the Ping task
const projectData = {
  name: `Ping Test with Steps ${timestamp}`, // Add timestamp for unique project names
  workflowVersion: 1, // Required version for steps workflow
  steps: [
    {
      taskId: 'iM24q2F3igh8jG2Bb4nJ', // Ping task ID
      indentLevel: 0, // Root level
    },
  ],
  organizationId: 'org-123',
  owners: ['user-123'],
  inputValues: [
    {
      PingPong: 'ping', // This will get responded to with "pong"
    },
  ],
  // Webhooks are handled through the dedicated webhook setup in this example
  // We don't include webhookUrl here so we won't get Firestore errors
};

async function runExample() {
  try {
    console.log('Setting up webhook server and creating project with custom steps...');

    // Create an API client with configuration
    const apiClient = new ApiClient({
      baseUrl: config.get('API_BASE_URL', 'https://us-central1-the-system-ai.cloudfunctions.net/'),
      apiKey: config.get('API_KEY'),
    });

    // Get webhook configuration from environment or use defaults
    const PORT = parseInt(config.get('WEBHOOK_PORT', '3001'), 10);
    const WEBHOOK_PATH = config.get('WEBHOOK_PATH', '/api/webhook');
    const WEBHOOK_BASE_URL = config.get('WEBHOOK_URL', `http://localhost:${PORT}`);

    console.log(`Using webhook base URL: ${WEBHOOK_BASE_URL}`);
    console.log(`Using webhook path: ${WEBHOOK_PATH}`);

    // Using the simplified API to create a project with webhook integration
    const result = await apiClient.createProjectWithWebhook({
      // The project request
      projectRequest: projectData,

      // Webhook server configuration
      webhookOptions: {
        port: PORT,
        path: WEBHOOK_PATH,
        baseUrl: WEBHOOK_BASE_URL,
      },

      // Event handlers
      handlers: {
        // When project is completed
        onProjectCompleted: async payload => {
          console.log('\n✅ Project completed:', payload.projectId);
          console.log('Data:', payload.data);

          // Fetch the project results
          try {
            console.log(`\nFetching results for project ${payload.projectId}...`);
            const projectResults = await apiClient.getProjectResults(payload.projectId);

            console.log('\nProject results:');
            console.log(JSON.stringify(projectResults, null, 2));
          } catch (error) {
            console.error('Failed to get project results:', error);
          }
        },

        // When project fails
        onProjectFailed: payload => {
          console.log('\n❌ Project failed:', payload.projectId);
          console.log('Error data:', payload.data);
        },

        // When feedback is needed
        onFeedbackNeeded: payload => {
          console.log('\n⚠️ Feedback needed:', payload.projectId);
          console.log('Feedback request:', payload.data);
        },

        // Generic handler for all webhook events
        onWebhook: payload => {
          console.log(`\n📣 Received webhook event: ${payload.type}`);
        },
      },

      // Automatically shut down after 5 minutes
      timeout: 5 * 60 * 1000,
    });

    // Extract values from the result
    const { projectId, webhookUrl } = result;

    console.log(`\nProject created with ID: ${projectId}`);
    console.log(`Project name: ${projectData.name}`);
    console.log(`Webhook URL: ${webhookUrl}`);
    console.log('\nWaiting for webhook notifications...');
    console.log(
      '(The server will automatically shut down after 5 minutes, or press Ctrl+C to stop)'
    );
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\nTROUBLESHOOTING:');
    console.log('1. Check your .env file for correct API_KEY and API_BASE_URL');
    console.log('2. Make sure ngrok is running and the URL in .env is current');
    console.log('3. See WEBHOOK-QUICKSTART.md for detailed setup instructions');
    console.log('4. Ensure the specified taskId exists and is accessible');
  }
}

// Run the example
runExample();
