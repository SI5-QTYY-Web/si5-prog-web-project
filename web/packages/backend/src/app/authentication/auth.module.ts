import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { ConfigModule } from '@nestjs/config';
import { UserSchema } from '../schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {AuthController} from "./auth.controller";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PassportModule,
    //We register to the JWTModule and setup the secret and the expiration time of the token
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [AuthController,],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
