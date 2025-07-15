import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from 'src/decorators/Public';
import { CreateOrUpdateUserDto } from './dto/createOrUpdateUser';
import { FindAllUsersDto } from './dto/usersList';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Lister tous les utilisateurs' })
  @ApiQuery({ name: 'page', required: false, description: 'Numéro de page' })
  @ApiQuery({ name: 'limit', required: false, description: 'Nombre d\'éléments par page' })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs' })
  @Get()
  async findAll(@Query() query: FindAllUsersDto) {
    const users = await this.usersService.findAll(query);

    return users;
  }

  @ApiOperation({ summary: 'Obtenir un utilisateur par son ID' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @Get('/:id')
  @ApiParam({ name: 'id' })
  findById(@Param('id') id) {
    console.log(id);

    return 'Find all users';
  }

  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  @ApiBody({ type: CreateOrUpdateUserDto })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  @Post()
  async createUser(@Body() createUser: CreateOrUpdateUserDto) {
    return await this.usersService.createUser(createUser);
  }

  @ApiOperation({ summary: 'Mettre à jour le mot de passe avec un token' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', description: 'Token de réinitialisation' },
        password: { type: 'string', description: 'Nouveau mot de passe' }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Mot de passe mis à jour avec succès' })
  @ApiResponse({ status: 400, description: 'Token invalide ou expiré' })
  @Put('password')
  @Public()
  async updatePassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    return await this.usersService.updatePassword(token, password);
  }

  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiBody({ type: CreateOrUpdateUserDto })
  @ApiResponse({ status: 200, description: 'Utilisateur mis à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUser: CreateOrUpdateUserDto,
  ) {
    return await this.usersService.updateUser(id, updateUser);
  }

  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({ status: 204, description: 'Utilisateur supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.usersService.deleteUser(id);

      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      console.error(error);

      res.status(500).json('Something went wrong');
    }
  }
}
