# Webhook Quick Start Guide

This guide provides step-by-step instructions for setting up and testing webhooks with the non-streaming example.

## 1. Install dependencies

First, make sure you have the required dependencies installed:

```bash
# Install express and body-parser
npm install express body-parser

# Install ngrok globally (if not already installed)
npm install -g ngrok
# Or with homebrew
# brew install ngrok
```

## 2. Create a secure webhook path

Generate a random component for your webhook path:

```bash
# Generate a random string
WEBHOOK_SECRET=$(openssl rand -hex 8)
echo "Your webhook path: /webhook/${WEBHOOK_SECRET}"

# Example output: Your webhook path: /webhook/a1b2c3d4e5f6abcd
```

Using a random path component adds security by making your webhook endpoint harder to guess.

## 3. Set up ngrok

Start ngrok to expose your local server to the internet:

```bash
ngrok http 3001
```

This will display a URL like `https://abc123.ngrok-free.app` - copy this URL.

![ngrok interface](https://ngrok.com/static/img/docs/user-interface.png)

## 4. Configure your environment

Create and configure your `.env` file:

```bash
# Copy the example .env
cp .env.example .env
```

Update your `.env` file with the following settings:

```
# Base URL for the API
API_BASE_URL=https://us-central1-the-system-ai.cloudfunctions.net/

# API key for authentication
API_KEY=your-api-key-here

# Webhook configuration with random secret path
# IMPORTANT: Use one of these two approaches, not both:

# OPTION 1 (RECOMMENDED): Separate the base URL and path components
WEBHOOK_URL=https://abc123.ngrok-free.app
WEBHOOK_PATH=/webhook/a1b2c3d4e5f6abcd
WEBHOOK_PORT=3001

# OPTION 2: Include the path in the URL (remove or comment out WEBHOOK_PATH)
# WEBHOOK_URL=https://abc123.ngrok-free.app/webhook/a1b2c3d4e5f6abcd
# WEBHOOK_PORT=3001
```

Make sure to replace:

- `abc123.ngrok-free.app` with your actual ngrok domain
- `a1b2c3d4e5f6abcd` with the random value generated in step 2
- `your-api-key-here` with your actual API key

## 5. Build the SDK

Make sure the SDK is built with the latest changes:

```bash
# From the project root
npm run build
```

## 6. Run the example

Run the non-streaming example with webhook support:

```bash
npm run example:non-streaming
```

The example will:

1. Start a webhook server on port 3001
2. Create a project with the ngrok webhook URL
3. Wait for webhook notifications when the project completes

## Monitoring webhook traffic

You can monitor the webhook traffic in two ways:

1. **ngrok Web Interface**: Open http://localhost:4040 to see all requests to your ngrok tunnel:

   ![ngrok web interface](https://ngrok.com/static/img/docs/web-interface-metrics.png)

2. **Example Output**: The non-streaming example will log all webhook events received:

   ```
   📣 Received webhook event: project_completed
   ✅ Project completed: lAAHgirutiIvAEjDhZDE
   Data: { documentId: '34PHgfCSDLLxj70b6T4h' }
   ```

## Manual webhook testing

You can manually test your webhook endpoint with curl:

```bash
curl -X POST https://abc123.ngrok-free.app/webhook/a1b2c3d4e5f6abcd \
  -H "Content-Type: application/json" \
  -d '{"type":"project_completed","projectId":"test-123","timestamp":"2023-01-01T00:00:00Z"}'
```

The example will show:

```
📣 Received webhook event: project_completed
✅ Project completed: test-123
```

## Troubleshooting

### Common issues

1. **Duplicate webhook paths**:

   - If you see URLs like `https://example.com/webhook/xyz/webhook/xyz`, you're duplicating the path
   - Use either Option 1 OR Option 2 from the environment setup, not both
   - If using Option 1, make sure WEBHOOK_URL is just the base URL without the path
   - If using Option 2, comment out or remove WEBHOOK_PATH

2. **Webhook URL mismatch**:

   - Check that the WEBHOOK_URL in `.env` exactly matches the ngrok URL.
   - Make sure there are no extra trailing slashes or typos.

3. **ngrok session expired**:

   - ngrok URLs expire after 2 hours on the free plan.
   - Restart ngrok if this happens and update your `.env` file with the new URL.

4. **Port already in use**:

   - If port 3001 is already in use, change the port in your `.env` file and use that port when starting ngrok.

5. **Express or body-parser not installed**:
   - If you see errors about missing express or body-parser modules, install them with:
     ```
     npm install express body-parser
     ```

### Debugging steps

If webhooks aren't working:

1. **Check ngrok console**:

   - Look at http://localhost:4040 to see if the webhook requests are reaching your ngrok tunnel.
   - Check the status codes - they should be 200 OK.

2. **Test the webhook directly**:

   - Use curl to send a test request to your webhook endpoint.
   - You should see the request in the ngrok interface and in your application logs.

3. **Check server logs**:

   - The application should log detailed information about the webhook server setup.
   - Look for errors or warnings in the console output.

4. **Verify correct ports**:

   - Make sure ngrok is tunneling to the same port that your application is listening on.
   - Both should be set to 3001 by default.

5. **Check firewall settings**:
   - Make sure outbound connections from your API server to your ngrok URL are allowed.
