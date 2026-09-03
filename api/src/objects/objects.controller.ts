import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ObjectsService } from './objects.service';
import { CreateObjectDto } from './dto/create-object.dto';
import { ObjectsGateway } from './objects.gateway';

@ApiTags('Objects')
@Controller('objects')
export class ObjectsController {
  constructor(
    private readonly objectsService: ObjectsService,
    private readonly objectsGateway: ObjectsGateway,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer un objet avec image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Mon objet' },
        description: { type: 'string', example: 'Une description' },
        image: { type: 'string', format: 'binary' },
      },
      required: ['title', 'description', 'image'],
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() dto: CreateObjectDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const obj = await this.objectsService.create(dto, file);
    this.objectsGateway.emitObjectCreated(obj);
    return obj;
  }

  @Get()
  @ApiOperation({ summary: 'Lister les objets avec recherche et pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 12 })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Recherche par titre ou description' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.objectsService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 12,
      search || undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un objet par ID' })
  async findOne(@Param('id') id: string) {
    return this.objectsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un objet' })
  async remove(@Param('id') id: string) {
    await this.objectsService.remove(id);
    this.objectsGateway.emitObjectDeleted(id);
    return { deleted: true };
  }
}
