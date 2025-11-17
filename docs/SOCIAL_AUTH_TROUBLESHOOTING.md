# Social Authentication Troubleshooting Guide

This guide covers common issues and solutions when implementing social authentication with Google and GitHub OAuth.

## Table of Contents
- [Google OAuth Issues](#google-oauth-issues)
- [GitHub OAuth Issues](#github-oauth-issues)
- [General Issues](#general-issues)
- [Testing OAuth Flows](#testing-oauth-flows)
- [Security Considerations](#security-considerations)

## Google OAuth Issues

### Issue: "redirect_uri_mismatch" Error
**Error**: `redirect_uri_mismatch`
**Cause**: The redirect URI in your Google Cloud Console doesn't match your application's callback URL.

**Solution**:
1. Go to [Google Cloud Console > APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)
2. Find your OAuth 2.0 Client ID
3. Click "Edit" and add the correct redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`

### Issue: "invalid_client" Error
**Error**: `invalid_client`
**Cause**: Incorrect client ID or client secret in environment variables.

**Solution**:
1. Verify your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`
2. Ensure you copied the correct values from Google Cloud Console
3. Check for extra spaces or special characters

### Issue: Google+ API Not Enabled
**Error**: `accessNotConfigured`
**Cause**: Required Google APIs are not enabled.

**Solution**:
1. Go to [Google Cloud Console > APIs & Services > Library](https://console.cloud.google.com/apis/library)
2. Search for and enable:
   - Google+ API
   - Google OAuth2 API

## GitHub OAuth Issues

### Issue: "Redirect URI mismatch" Error
**Error**: `Redirect URI mismatch`
**Cause**: The authorization callback URL in your GitHub OAuth App doesn't match.

**Solution**:
1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/applications)
2. Find your OAuth App and click "Edit"
3. Set the correct Authorization callback URL:
   - Development: `http://localhost:3000/api/auth/callback/github`
   - Production: `https://yourdomain.com/api/auth/callback/github`

### Issue: "Incorrect client credentials" Error
**Error**: `Incorrect client credentials`
**Cause**: Invalid Client ID or Client Secret.

**Solution**:
1. Verify your `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in `.env.local`
2. Regenerate your GitHub OAuth App secrets if necessary
3. Ensure no trailing spaces or newlines in environment variables

## General Issues

### Issue: Social Login Buttons Not Showing
**Cause**: Environment variables not set correctly.

**Solution**:
1. Check that your `.env.local` file contains the required variables:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```
2. Restart your development server after changing environment variables

### Issue: Authentication Fails Silently
**Cause**: Missing or incorrect Better Auth configuration.

**Solution**:
1. Verify your `lib/auth.ts` social providers configuration
2. Check that `enabled: true` for configured providers
3. Review server logs for authentication errors

### Issue: User Not Created in Database
**Cause**: Social authentication succeeded but user creation failed.

**Solution**:
1. Check your database connection
2. Verify Better Auth database schema is properly installed
3. Review server logs for database errors
4. Ensure `afterSignIn` callback is not throwing errors

### Issue: Polar Customer Creation Fails
**Cause**: Polar API integration issues with social users.

**Solution**:
1. Verify your `POLAR_ACCESS_TOKEN` is valid
2. Check that Polar webhook secret is configured
3. Review server logs for Polar-related errors
4. Ensure the `afterSignIn` callback in `lib/auth.ts` is working

## Testing OAuth Flows

### Local Development Testing
1. Set up local environment variables
2. Use `http://localhost:3000` as your callback URL
3. Test with private/incognito browser window to avoid cached sessions

### Production Testing
1. Update OAuth app configurations with production URLs
2. Test in a staging environment first
3. Monitor server logs for authentication errors

### Debug Mode
Enable Better Auth debug mode by adding to your environment:
```env
DEBUG=better-auth:*
```

## Security Considerations

### Environment Variables
- Never commit OAuth secrets to version control
- Use different client IDs/secrets for development and production
- Rotate secrets regularly

### Redirect URI Security
- Always use HTTPS in production
- Don't use wildcard redirect URIs
- Validate redirect URIs in OAuth provider settings

### Token Storage
- Better Auth handles token storage securely
- Tokens are stored in the database, not localStorage
- Session cookies are used for authentication

### Account Linking
- Verify email addresses when linking accounts
- Implement proper user confirmation for sensitive operations
- Handle account unlinking carefully to avoid locking users out

## Common Error Messages and Solutions

| Error Message | Common Cause | Solution |
|---------------|--------------|----------|
| `redirect_uri_mismatch` | Incorrect redirect URI in OAuth provider | Update redirect URIs in OAuth provider settings |
| `invalid_client` | Wrong client ID/secret | Verify environment variables |
| `access_denied` | User denied authorization | User needs to grant permission - this is normal behavior |
| `Authentication failed` | Better Auth configuration issue | Check `lib/auth.ts` configuration |
| `Database connection failed` | Database issues | Verify database connection and schema |

## Getting Help

If you're still experiencing issues:

1. Check the [Better Auth documentation](https://better-auth.com/docs)
2. Review your server logs for detailed error messages
3. Ensure all required environment variables are set
4. Test with a fresh OAuth app configuration
5. Check network connectivity and firewall settings

Remember to never share your OAuth secrets or commit them to version control!