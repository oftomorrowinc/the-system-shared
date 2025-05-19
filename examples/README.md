# API Client Examples

This directory contains examples demonstrating how to use the API client SDK for interacting with the-system-server.

## Prerequisites

1. Build the SDK from the project root directory:

   ```
   cd ..
   npm run build
   cd examples
   ```

2. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Then edit the `.env` file with your specific configuration.
3. For webhook examples, install the required dependencies:
   ```
   npm install express body-parser
   ```

## Running the Examples

You can run the examples directly using npm scripts:

```
# From the project root directory:
npm run example:streaming     # Run the streaming example
npm run example:non-streaming # Run the non-streaming example
```

Or directly with Node:

```
node examples/streaming-example.js
node examples/non-streaming-example.js
```

## Examples

### Non-Streaming Example with Webhooks

The [non-streaming-example.js](./non-streaming-example.js) demonstrates:

- Setting up a webhook server to receive project updates
- Creating a project with the PingPong workflow
- Receiving completion notifications via webhook
- Fetching the final results automatically when completed

This example uses our simplified API that handles webhook server setup and event handling in a single call.

**For detailed webhook setup instructions, see the [Webhook Quick Start Guide](./WEBHOOK-QUICKSTART.md).**

### Streaming Example

The [streaming-example.js](./streaming-example.js) demonstrates:

- Creating a project with streaming enabled
- Processing real-time updates as they arrive

## Webhook Integration

The SDK provides easy webhook integration with the following features:

### 1. WebhookHandler

The `WebhookHandler` class is an event emitter that handles incoming webhook requests and emits events for different webhook types:

```javascript
const { WebhookHandler, WebhookEventType } = require('the-system-shared');

const webhookHandler = new WebhookHandler({
  path: '/webhook/my-random-secret',
  secret: 'optional-webhook-secret',
});

// Register event handlers
webhookHandler.onProjectCompleted(payload => {
  console.log('Project completed:', payload.projectId);
});

webhookHandler.onProjectFailed(payload => {
  console.log('Project failed:', payload.projectId);
});

webhookHandler.onFeedbackNeeded(payload => {
  console.log('Feedback needed:', payload.projectId);
});

// Use with Express
app.post('/webhook/my-random-secret', webhookHandler.createExpressMiddleware());

// Use with Next.js
export default webhookHandler.createNextApiHandler();
```

### 2. setupWebhookServer Helper

For quick webhook server setup, use the `setupWebhookServer` helper:

```javascript
const { setupWebhookServer } = require('the-system-shared');

const { webhookHandler, webhookUrl, start } = await setupWebhookServer({
  port: 3001,
  path: '/webhook/my-random-secret',
  baseUrl: 'https://abc123.ngrok-free.app',
});

// Register event handlers
webhookHandler.onProjectCompleted(payload => {
  console.log('Project completed:', payload.projectId);
});

// Start the server
const server = await start();
console.log(`Webhook server listening at ${webhookUrl}`);

// Later, when you're done:
server.close();
```

### 3. ApiClient.createProjectWithWebhook

For an all-in-one solution, use the API client's createProjectWithWebhook method:

```javascript
const { ApiClient } = require('the-system-shared');

const apiClient = new ApiClient({
  baseUrl: 'https://us-central1-the-system-ai.cloudfunctions.net/',
  apiKey: 'your-api-key',
});

const { projectId, webhookUrl, stop } = await apiClient.createProjectWithWebhook({
  // The project request
  projectRequest: {
    name: `Test Project ${Date.now()}`, // Add timestamp for uniqueness
    workflowId: 'workflow-id',
    workflowVersion: 1,
    organizationId: 'org-id',
    owners: ['user-id'],
    inputValue: {
      // Your project input
    },
  },

  // Webhook server configuration
  webhookOptions: {
    port: 3001,
    path: '/webhook/my-random-secret',
    baseUrl: 'https://abc123.ngrok-free.app',
  },

  // Event handlers
  handlers: {
    onProjectCompleted: async payload => {
      console.log('Project completed:', payload.projectId);
      // Fetch results, update UI, etc.
    },
    onProjectFailed: payload => {
      console.log('Project failed:', payload.projectId);
    },
  },

  // Auto-shutdown after 5 minutes (optional)
  timeout: 5 * 60 * 1000,
});

// Later, to manually stop the server:
// stop();
```

## Using with ngrok for Local Development

For local development, you can use ngrok to expose your local webhook server:

1. Install ngrok: https://ngrok.com/download

2. Generate a random string for your webhook path (for security):

   ```bash
   # On macOS/Linux:
   openssl rand -hex 8

   # Example output: a1b2c3d4e5f6abcd
   ```

3. Start ngrok to create a public URL:

   ```bash
   ngrok http 3001
   ```

4. Update your `.env` file with the ngrok URL and your random path:
   ```
   WEBHOOK_URL=https://abc123.ngrok-free.app
   WEBHOOK_PATH=/webhook/a1b2c3d4e5f6abcd
   WEBHOOK_PORT=3001
   ```

For a step-by-step guide on setting up webhook testing with ngrok, see the [Webhook Quick Start Guide](./WEBHOOK-QUICKSTART.md).

## Testing Webhook Functionality

Comprehensive tests for the webhook functionality are available in the source code:

1. **Webhook Handler Tests**: `src/lib/__tests__/webhook-helper.test.ts`

   - Tests for webhook event handling
   - Tests for middleware creation
   - Tests for webhook server setup

2. **API Client Webhook Integration Tests**: `src/lib/__tests__/api-client-webhook.test.ts`
   - Tests for the createProjectWithWebhook method
   - Tests for webhook URL handling
   - Tests for event handler registration

You can run these tests using:

```bash
npm test
```

These tests provide additional examples of how to use the webhook functionality in different scenarios and can be a useful reference beyond the basic examples provided here.
