import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Dashboard from 'supertokens-node/recipe/dashboard';
import EmailVerification from 'supertokens-node/recipe/emailverification';
import Session from 'supertokens-node/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import UserMetadata from 'supertokens-node/recipe/usermetadata';
import { AuthModuleConfig, ConfigInjectionToken } from '../config.interface';
import { EmailService } from '../../email/email.service';
import UserRoles from 'supertokens-node/recipe/userroles';

@Injectable()
export class SupertokensService {
  constructor(
    @Inject(ConfigInjectionToken) private config: AuthModuleConfig,
    private emailService: EmailService,
  ) {
    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [
        ThirdPartyEmailPassword.init({
          signUpFeature: {
            formFields: [
              {
                id: 'first_name',
              },
              {
                id: 'last_name',
              },
            ],
          },
          emailDelivery: {
            override: (originalImplementation) => {
              return {
                ...originalImplementation,
                sendEmail: async function (input) {
                  await emailService.sendResetPasswordEmail({
                    email: input.user.email,
                    passwordResetLink: input.passwordResetLink,
                  });
                },
              };
            },
          },
          override: {
            apis: (originalImplementation) => {
              return {
                ...originalImplementation,
                thirdPartySignInUpPOST: async function (input) {
                  if (
                    originalImplementation.thirdPartySignInUpPOST === undefined
                  ) {
                    throw Error('Should never come here');
                  }
                  const response =
                    await originalImplementation.thirdPartySignInUpPOST(input);
                  if (response.status === 'OK' && response.createdNewUser) {
                    let updatedUser:
                      | {
                          first_name?: string;
                          last_name?: string;
                          avatarUrl?: string;
                        }
                      | undefined = undefined;
                    if (response.user.thirdParty.id === 'apple') {
                      const user = response.rawUserInfoFromProvider
                        .fromIdTokenPayload.user as {
                        email: string;
                        first_name: string;
                        last_name: string;
                      };
                      updatedUser = {
                        first_name: user.first_name,
                        last_name: user.last_name,
                      };
                    } else if (response.user.thirdParty.id === 'github') {
                      const rawUser = response.rawUserInfoFromProvider
                        .fromUserInfoAPI as {
                        user: {
                          name: string;
                          avatar_url?: string;
                        };
                      };
                      updatedUser = {
                        first_name: rawUser.user.name,
                        avatarUrl: typeof rawUser.user.avatar_url
                          ? rawUser.user?.avatar_url
                          : undefined,
                        last_name: '',
                      };
                    } else if (response.user.thirdParty.id === 'google') {
                      const user = response.rawUserInfoFromProvider
                        .fromIdTokenPayload as {
                        email: string;
                        given_name: string;
                        family_name: string;
                        picture: string;
                      };
                      updatedUser = {
                        first_name: user.given_name,
                        last_name: user.family_name,
                        avatarUrl: user.picture,
                      };
                    }
                    await Promise.all([
                      UserMetadata.updateUserMetadata(
                        response.user.id,
                        updatedUser,
                      ),
                      UserRoles.createNewRoleOrAddPermissions('user', [
                        'read',
                        'write',
                      ]),
                    ]);
                    await UserRoles.addRoleToUser(
                      input.tenantId,
                      response.user.id,
                      'user',
                    );
                  }
                  return response;
                },
                emailPasswordSignUpPOST: async function (input) {
                  if (
                    originalImplementation.emailPasswordSignUpPOST === undefined
                  ) {
                    throw Error('Should never come here');
                  }

                  const response =
                    await originalImplementation.emailPasswordSignUpPOST(input);
                  if (response.status === 'OK') {
                    const formFields = input.formFields;
                    await UserMetadata.updateUserMetadata(response.user.id, {
                      first_name: formFields.find((f) => f.id === 'first_name')
                        .value,
                      last_name: formFields.find((f) => f.id === 'last_name')
                        .value,
                    });
                    await EmailVerification.sendEmailVerificationEmail(
                      input.tenantId,
                      response.user.id,
                      response.user.email,
                      input.userContext,
                    );
                    await UserRoles.createNewRoleOrAddPermissions('user', [
                      'read',
                      'write',
                    ]);
                    await UserRoles.addRoleToUser(
                      input.tenantId,
                      response.user.id,
                      'user',
                    );
                  }

                  return response;
                },
              };
            },
          },
          providers: [
            {
              config: {
                thirdPartyId: 'apple',
                clients: [
                  {
                    clientId: process.env.APPLE_CLIENT_ID,
                    clientType: 'service',
                    additionalConfig: {
                      keyId: process.env.APPLE_KEY_ID,
                      privateKey: process.env.APPLE_PRIVATE_KEY,
                      teamId: process.env.APPLE_TEAM_ID,
                    },
                  },
                ],
              },
            },
            {
              config: {
                thirdPartyId: 'github',
                clients: [
                  {
                    clientType: 'ios',
                    clientId: process.env.GITHUB_CLIENT_ID,
                    clientSecret: process.env.GITHUB_CLIENT_SECRET,
                  },
                ],
              },
            },
            {
              config: {
                thirdPartyId: 'google',
                clients: [
                  {
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    clientType: 'ios',
                  },
                ],
              },
            },
          ],
        }),
        UserRoles.init(),
        EmailVerification.init({
          mode: 'REQUIRED',
          emailDelivery: {
            override: (originalImplementation) => {
              return {
                ...originalImplementation,
                sendEmail: async function (input) {
                  await emailService.sendVerificationEmail({
                    email: input.user.email,
                    emailVerifyLink: input.emailVerifyLink,
                  });
                },
              };
            },
          },
        }),
        Session.init(),
        Dashboard.init(),
        UserMetadata.init(),
      ],
    });
  }
}
