import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/filter/auth.guard';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(new AuthGuard())
export class UserController {
  constructor(private readonly userService: UserService) {}
}
