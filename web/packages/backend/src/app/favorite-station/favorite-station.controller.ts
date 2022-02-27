import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { User } from '../schemas/user.schema';
import { FavoriteStationService } from './favorite-station.service';

@Controller('favorite-station')
export class FavoriteStationController {

    constructor(private favoriteStationService:FavoriteStationService){}

    @UseGuards(JwtAuthGuard)
    @Get('user-station')
    async getUserFavoriteStation(@Request() req: Request&{user:User}){
        return await this.favoriteStationService.getUserFavoriteStations(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-user-station')
    updatetUserFavoriteStation(@Request() req: Request&{user:User}, @Body("favoriteStations") favStations:string[]){
        this.favoriteStationService.setUserFavoriteStations(req.user,favStations);
    }
}
