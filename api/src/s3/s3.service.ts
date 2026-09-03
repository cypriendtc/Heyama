import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service implements OnModuleInit {
  private client: Minio.Client;
  private bucket: string;

  constructor(private config: ConfigService) {
    this.bucket = this.config.get<string>('MINIO_BUCKET') || 'heyama-objects';
    this.client = new Minio.Client({
      endPoint: this.config.get<string>('MINIO_ENDPOINT') || 'localhost',
      port: parseInt(this.config.get<string>('MINIO_PORT') || '9000', 10),
      useSSL: this.config.get<string>('MINIO_USE_SSL') === 'true',
      accessKey: this.config.get<string>('MINIO_ACCESS_KEY') || 'minioadmin',
      secretKey: this.config.get<string>('MINIO_SECRET_KEY') || 'minioadmin',
    });
  }

  async onModuleInit() {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket);
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucket}/*`],
          },
        ],
      };
      await this.client.setBucketPolicy(this.bucket, JSON.stringify(policy));
    }
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const ext = file.originalname.split('.').pop();
    const key = `${uuidv4()}.${ext}`;
    await this.client.putObject(this.bucket, key, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });
    const endpoint = this.config.get<string>('MINIO_ENDPOINT') || 'localhost';
    const port = this.config.get<string>('MINIO_PORT') || '9000';
    return `http://${endpoint}:${port}/${this.bucket}/${key}`;
  }

  async delete(imageUrl: string): Promise<void> {
    const key = imageUrl.split('/').pop();
    if (key) {
      await this.client.removeObject(this.bucket, key);
    }
  }
}
