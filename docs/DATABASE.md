# Database

PostgreSQL is the primary datastore.

Expected core entities:

- users
- characters
- conversations
- messages
- memories
- subscriptions
- usage records

All schema changes must use migrations.

Never manually modify production schema without a migration.
