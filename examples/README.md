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
   
   Note: The examples include a simple config helper that will load the .env file automatically.

## Examples

### Non-Streaming Example

The [non-streaming-example.js](./non-streaming-example.js) demonstrates:
- Creating a project without streaming
- Waiting for processing to complete
- Fetching the results

Run with:
```
node non-streaming-example.js
```

### Streaming Example

The [streaming-example.js](./streaming-example.js) demonstrates:
- Creating a project with streaming enabled
- Processing real-time updates as they arrive

Run with:
```
node streaming-example.js
```

## Webhook Integration

To test webhook integration, you would need:
1. A publicly accessible URL (tools like ngrok can help with local development)
2. Update the WEBHOOK_URL in your .env file
3. Implement a webhook handler on your server using the WebhookHandler class

An example webhook server implementation can be found in the main documentation.