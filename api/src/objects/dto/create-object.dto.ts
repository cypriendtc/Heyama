import { ApiProperty } from '@nestjs/swagger';

export class CreateObjectDto {
  @ApiProperty({ example: 'Mon objet', description: 'Titre de l\'objet' })
  title: string;

  @ApiProperty({ example: 'Une description détaillée', description: 'Description de l\'objet' })
  description: string;
}
