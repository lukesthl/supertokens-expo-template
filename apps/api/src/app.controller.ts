import { Controller, Delete, Get, Post, Session, UseGuards } from "@nestjs/common";
import { EmailVerificationClaim } from "supertokens-node/recipe/emailverification";
import type { SessionClaimValidator } from "supertokens-node/recipe/session";
import { SessionContainer } from "supertokens-node/recipe/session";
import UserRoles, { PermissionClaim, UserRoleClaim } from "supertokens-node/recipe/userroles";

import { AuthGuard } from "./auth/filter/auth.guard";

@Controller()
export class AppController {
  @Get("test")
  @UseGuards(
    new AuthGuard({
      overrideGlobalClaimValidators: (globalValidators: SessionClaimValidator[]) => [
        ...globalValidators,
        EmailVerificationClaim.validators.isVerified(),
      ],
    })
  )
  getTest(@Session() session: SessionContainer): string {
    return session.getUserId();
  }

  @Get("admin")
  @UseGuards(
    new AuthGuard({
      overrideGlobalClaimValidators: (globalValidators: SessionClaimValidator[]) => [
        ...globalValidators,
        UserRoles.UserRoleClaim.validators.includes("admin"),
      ],
    })
  )
  admin(): string {
    return "you're an admin";
  }

  // totally insecure route, just for demo purposes
  @Post("make-me-an-admin")
  @UseGuards(
    new AuthGuard({
      overrideGlobalClaimValidators: (globalValidators: SessionClaimValidator[]) => [
        ...globalValidators,
        EmailVerificationClaim.validators.isVerified(),
      ],
    })
  )
  async setRole(@Session() session: SessionContainer) {
    await UserRoles.createNewRoleOrAddPermissions("admin", ["read", "write"]);
    const response = await UserRoles.addRoleToUser(session.getTenantId(), session.getUserId(), "admin");

    await session.fetchAndSetClaim(UserRoleClaim);
    await session.fetchAndSetClaim(PermissionClaim);
    return response;
  }

  // totally insecure route, just for demo purposes
  @Delete("remove-admin")
  @UseGuards(
    new AuthGuard({
      overrideGlobalClaimValidators: (globalValidators: SessionClaimValidator[]) => [
        ...globalValidators,
        UserRoles.UserRoleClaim.validators.includes("admin"),
      ],
    })
  )
  async removeAdmin(@Session() session: SessionContainer) {
    const response = await UserRoles.removeUserRole(session.getTenantId(), session.getUserId(), "admin");
    await session.fetchAndSetClaim(UserRoleClaim);
    await session.fetchAndSetClaim(PermissionClaim);
    return response;
  }
}
