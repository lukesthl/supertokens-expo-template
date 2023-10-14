import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
  Render,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import EmailVerification from 'supertokens-node/recipe/emailverification';
import SessionService from 'supertokens-node/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import UserRoles from 'supertokens-node/recipe/userroles';
import { AuthGuard } from './filter/auth.guard';
import {
  getUserMetadata,
  updateUserMetadata,
  clearUserMetadata,
} from 'supertokens-node/recipe/usermetadata';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { JwtService } from '@nestjs/jwt';
import { deleteUser } from 'supertokens-node';
import { EmailService } from '../email/email.service';

@Controller()
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  @UseGuards(new AuthGuard())
  @Get('/auth/session')
  @HttpCode(200)
  async getSession(@Session() session: SessionContainer) {
    const [metaDataResponse, user, roles] = await Promise.all([
      getUserMetadata(session.getUserId()),
      ThirdPartyEmailPassword.getUserById(session.getUserId()),
      UserRoles.getRolesForUser(session.getTenantId(), session.getUserId()),
    ]);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      metadata: { ...metaDataResponse.metadata, email: user.email },
      session: {
        thirdParty: user.thirdParty ?? null,
        userId: session.getUserId(),
      },
      roles: roles.roles,
    };
  }

  @UseGuards(new AuthGuard())
  @Patch('/auth/user')
  async updateUser(
    @Session() session: SessionContainer,
    @Body()
    body: {
      formFields: { id: string; value: string }[];
    },
  ) {
    const { formFields } = body;
    const allowedFormFields = ['first_name', 'last_name', 'avatarUrl'];
    const metadata = {};
    for (const formField of formFields) {
      if (allowedFormFields.includes(formField.id)) {
        metadata[formField.id] = formField.value;
      }
    }
    const avatarUrl = formFields.find(
      (field) => field.id === 'avatarUrl',
    ).value;
    if (avatarUrl) {
      const buffer = Buffer.from(
        avatarUrl.substring(avatarUrl.indexOf(',') + 1),
      );
      console.log('Image Upload in MB: ' + buffer.length / 1e6);
    }
    return await updateUserMetadata(session.getUserId(), metadata);
  }

  @Get('/auth/verify-email')
  @Render('auth/verify-email/index.hbs')
  async verifyEmail(@Query() query) {
    const { token, rid, tenantId } = query;
    if (!token || !rid || !tenantId || rid !== 'emailverification') {
      throw new BadRequestException();
    }
    const response = await EmailVerification.verifyEmailUsingToken(
      tenantId,
      token,
    );
    if (response.status === 'OK') {
      await ThirdPartyEmailPassword.updateEmailOrPassword({
        userId: response.user.id,
        email: response.user.email,
      });
    }
    console.log(response);
    return {};
  }

  @Get('/auth/reset-password')
  @Render('auth/reset-password/index.hbs')
  resetPasswort() {
    return {};
  }

  @Post('/auth/change-password')
  @UseGuards(new AuthGuard())
  async changePassword(
    @Session() session: SessionContainer,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    const { oldPassword, newPassword } = body;
    const userId = session.getUserId();

    const userInfo = await ThirdPartyEmailPassword.getUserById(userId);

    if (userInfo === undefined) {
      throw new Error('Should never come here');
    }

    const passwordValidResponse =
      await ThirdPartyEmailPassword.emailPasswordSignIn(
        session.getTenantId(),
        userInfo.email,
        oldPassword,
      );

    if (passwordValidResponse.status !== 'OK') {
      return passwordValidResponse;
    }

    const response = await ThirdPartyEmailPassword.updateEmailOrPassword({
      userId,
      password: newPassword,
      tenantIdForPasswordPolicy: session!.getTenantId(),
    });

    if (response.status !== 'OK') {
      return response;
    }
    const sessionId = session.getHandle();
    const sessionHandles =
      await SessionService.getAllSessionHandlesForUser(userId);
    const sessionHandlesToRevoke = sessionHandles.filter(
      (handle) => handle !== sessionId,
    );
    await SessionService.revokeMultipleSessions(sessionHandlesToRevoke);
    return response;
  }

  @Post('/auth/change-email')
  @UseGuards(new AuthGuard())
  async changeMail(
    @Session() session: SessionContainer,
    @Body() body: { email: string },
  ) {
    const { email } = body;

    if (!isValidEmail(email)) {
      return {
        status: 'FIELD_ERROR',
        formFields: [
          {
            id: 'email',
            error: 'Please enter a valid email address',
          },
        ],
      };
    }

    const sessionId = session.getUserId();
    const userAccount = await ThirdPartyEmailPassword.getUserById(sessionId!);
    if (userAccount.thirdParty !== undefined) {
      return {
        status: 'GENERAL_ERROR',
        message: 'You are not allowed to change your email address',
      };
    }

    const isVerified = await EmailVerification.isEmailVerified(
      session.getUserId(),
      email,
    );

    if (!isVerified) {
      const user = await ThirdPartyEmailPassword.getUserById(
        session.getUserId(),
      );
      for (const tenantId of user.tenantIds) {
        // Since once user can be shared across many tenants, we need to check if
        // the email already exists in any of the tenants.
        const usersWithEmail = await ThirdPartyEmailPassword.getUsersByEmail(
          tenantId,
          email,
        );
        for (const userWithEmail of usersWithEmail) {
          if (userWithEmail.id !== session.getUserId()) {
            // TODO handle error, email already exists with another user.
            return {
              status: 'EMAIL_ALREADY_EXISTS_ERROR',
              message: 'Email already exists with another user',
            };
          }
        }
      }
      const response = await EmailVerification.sendEmailVerificationEmail(
        session.getTenantId(),
        session.getUserId(),
        email,
      );
      return response;
    }

    const response = await ThirdPartyEmailPassword.updateEmailOrPassword({
      userId: session.getUserId(),
      email: email,
    });

    return response;
  }

  @UseGuards(new AuthGuard())
  @Post('/auth/delete-account')
  @HttpCode(200)
  async deleteAccount(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    const jwtPayload = {
      userId,
      tenantId: session.getTenantId(),
    };
    const token = this.jwtService.sign(jwtPayload, {
      secret: process.env.ACCOUNT_JWT_SECRET,
      expiresIn: '15m',
    });

    const response = await ThirdPartyEmailPassword.getUserById(userId);
    if (!response) {
      throw new BadRequestException();
    }
    const { email } = response;
    const deleteUrl = `${process.env.API_DOMAIN}/auth/delete-account/verify?token=${token}`;
    await this.emailService.sendAccountDeletionMail({
      email,
      accountDeletionLink: deleteUrl,
    });
    return {
      status: 'OK',
    };
  }

  @Get('/auth/delete-account/verify')
  @Render('auth/delete-account/index.hbs')
  @HttpCode(200)
  async deleteAccountVerify(@Query() query) {
    const token = query.token;
    if (!token) {
      throw new BadRequestException();
    }
    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.ACCOUNT_JWT_SECRET,
      });
      if (!payload) {
        throw new BadRequestException();
      }
      const { userId } = payload;
      await clearUserMetadata(userId);
      const response = await deleteUser(userId);
      if (response.status === 'OK') {
        await SessionService.revokeAllSessionsForUser(userId);
        return {};
      } else {
        throw new BadRequestException();
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }
}

function isValidEmail(email: string) {
  const regexp = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
  return regexp.test(email);
}

interface JwtPayload {
  userId: string;
  tenantId: string;
  iat: number;
  exp: number;
}
