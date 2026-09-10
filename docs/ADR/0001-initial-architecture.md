# ADR-0001: Initial Architecture

## Status

Accepted

## Decision

Use a modular monolith with:

- Next.js
- TypeScript
- PostgreSQL
- Redis
- Internal AI gateway

## Reason

The project is an early-stage two-person product.

The architecture should optimize for:

- development speed
- simplicity
- reliability
- low operational overhead

Microservices can be introduced later when justified.
