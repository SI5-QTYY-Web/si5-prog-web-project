import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import {AuthService} from "./auth.service";
import {User} from "../schemas/user.schema";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return await this.authService.signUp(authCredentialsDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: Request&{user:User}) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: Request&{user:User}) {
    return req.user;
  }
}
