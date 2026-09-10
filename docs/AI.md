# AI Architecture

OpenRouter is the initial model gateway.

Requirements:

- Streaming
- Central model configuration
- Primary model
- Fallback models
- Token usage tracking
- Cost tracking
- Error handling
- Rate limiting
- Timeouts

Application code should not call OpenRouter directly from UI components.

Model IDs must be centralized.

User-generated character content and messages are untrusted input.
