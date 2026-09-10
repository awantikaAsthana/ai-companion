# Memory

Use three layers.

## L1 - Short Term

Recent messages.

Target roughly 10-20 messages depending on token budget.

## L2 - Conversation Summary

Compact summary of older conversation context.

## L3 - Durable Memory

Important facts that survive conversations.

Examples:

- Preferences
- Relationships
- Interests
- Important events
- Character-specific facts

Durable memories should include:

- content
- category
- importance
- confidence
- timestamps
- source conversation

Memory extraction should run asynchronously where possible.
