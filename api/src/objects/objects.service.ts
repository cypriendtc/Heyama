import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectEntity } from './schemas/object.schema';
import { CreateObjectDto } from './dto/create-object.dto';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectModel(ObjectEntity.name) private objectModel: Model<ObjectEntity>,
    private s3Service: S3Service,
  ) {}

  async create(
    dto: CreateObjectDto,
    file: Express.Multer.File,
  ): Promise<ObjectEntity> {
    const imageUrl = await this.s3Service.upload(file);
    const created = new this.objectModel({
      title: dto.title,
      description: dto.description,
      imageUrl,
    });
    return created.save();
  }

  async findAll(): Promise<ObjectEntity[]> {
    return this.objectModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<ObjectEntity> {
    const obj = await this.objectModel.findById(id).exec();
    if (!obj) throw new NotFoundException(`Object ${id} not found`);
    return obj;
  }

  async remove(id: string): Promise<void> {
    const obj = await this.objectModel.findById(id).exec();
    if (!obj) throw new NotFoundException(`Object ${id} not found`);
    await this.s3Service.delete(obj.imageUrl);
    await this.objectModel.findByIdAndDelete(id).exec();
  }
}
