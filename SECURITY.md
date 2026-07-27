# Security Policy

## Reporting a Vulnerability

Please do not report security vulnerabilities through public GitHub issues.

Email **security@timechainlabs.io** with:

- A description of the issue and its impact
- Steps to reproduce or a proof of concept
- Affected package versions

We will acknowledge your report within 2 business days and keep you informed of
progress toward a fix. Please give us a reasonable window to remediate before
any public disclosure.

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 2.x     | Yes       |
| < 2.0   | No        |

## Handling Secrets

- Never commit `authToken`, app secrets, or OAuth client secrets to source control.
- Auth tokens obtained via `sdk.auth.login()` are held in memory only; the SDK
  never persists credentials to disk.
- Use environment variables or a secret manager to inject credentials, and use
  the sandbox environment (`new NeucronSDK({ sandbox: true })`) for testing.
