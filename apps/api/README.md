<p align="center" style="display:flex; justify-content:center; align-items:center">
      <img src="https://nestjs.com/img/logo-small.svg" height="56"><img src="../../docs/supertokens-logo.png" height="64">
</p>

# Nestjs Template with Supertokens Authentication

This project template provides the backend for developing a React Native application with Expo and Supertokens to authenticate. It is built with [Nestjs](https://nestjs.com/) and [Supertokens](https://supertokens.io/).

## Key Features:

- [**Sign in with Apple, GitHub, Google, or Email and Password**](https://supertokens.com/docs/thirdpartyemailpassword/introduction): The authentication flow supports multiple sign-in options using Supertokens.
- [**Role Management**](https://supertokens.com/docs/userroles/introduction): You can manage user roles and permissions within your application using Supertokens.
- **Change Password, Verify E-Mail and Delete Account Views**: Connect your app to a website by adding support for deep linking.
- [**Handlebars E-Mail Templates**](https://handlebarsjs.com/): It utilizes Expo Router, a versatile routing solution for navigating between screens in your application.

## Getting Started

To use this template, follow the steps below:

1. Install dependencies  
   `yarn install`
2. Configure the Supertokens Backend with your authentication providers (Apple, GitHub, Google, etc.)
3. Setup environment variables:

- `cp ./apps/api.env.example ./apps/api/.env`
- Update the necessary environment variables for Supertokens configuration. For example:

  ```
   SUPERTOKENS_CONNECTION_URI=your-supertokens-connection-uri
   SUPERTOKENS_API_KEY=your-supertokens-api-key
   ACCOUNT_JWT_SECRET=custom-jwt-secret # jwt secret for delete account token
   RESEND_API_KEY=your-resend-api-key # Get this from https://resend.com/api-keys
   EMAIL_FROM=test@example.com
  ```

5. Start the app  
   `yarn run api`

### Configuring the Authentication Providers

To configure Supertokens with your authentication providers, follow the documentation provided by Supertokens. This typically involves registering your app with each provider and obtaining API keys or tokens required for authentication.

### Apple

Generate a private key for your Apple App ID. You can find more information about this [here](https://developer.apple.com/help/account/configure-app-capabilities/configure-sign-in-with-apple-for-the-web/).

```
 APPLE_CLIENT_ID=your-apple-client-id
 APPLE_PRIVATE_KEY=your-apple-private-key
 APPLE_TEAM_ID=your-apple-team-id
 APPLE_KEY_ID=your-apple-key-id
```

### GitHub

Register your app with GitHub and obtain a client ID and secret. You can find more information about this [here](https://docs.github.com/en/developers/apps/creating-an-oauth-app).

```
 GITHUB_CLIENT_ID=your-github-client-id
 GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Google

Register your app with Google and obtain a client ID and secret. You can find more information about this [here](https://developers.google.com/identity/protocols/oauth2).

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Customizing the Template

Customizing the E-Mails in the template is easy. Simply edit the Handlebars templates in the `./emails/auth` folder. For Updating the HTML views, edit the files in the `./views/auth` folder.

## Setup Apple App site association (ASA)

For iOS, you need to setup the Apple App site association (ASA) file. This is required for deep linking to work on iOS. The File can be found in the `./public/.well-known` folder. You can find more information about this [here](https://docs.expo.dev/guides/deep-linking/).

### Known Issues

## Learn more

- [Supertokens Documentation](https://supertokens.io/docs/)
- [Nestjs Documentation](https://docs.nestjs.com/)
