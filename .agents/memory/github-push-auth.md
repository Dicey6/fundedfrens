---
name: GitHub push authorization
description: GitHub pushes may require Replit's connected GitHub source-control authorization rather than an arbitrary project secret.
---

The GitHub push helper depends on Replit's GitHub source-control connection. A project secret named like a personal access token is not guaranteed to be valid for Git operations.

**Why:** A repository push can fail even when a token-shaped secret exists, and retrying the same credential does not resolve the authorization mismatch.

**How to apply:** When a push fails with missing or invalid GitHub credentials, use the secure GitHub connection flow; do not expose or paste tokens into chat.