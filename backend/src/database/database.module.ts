import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { GameEntity } from './entities/game.entity';
import { PaymentEntity } from './entities/payment.entity';
import { ReservationEntity } from './entities/reservation.entity';
import { RoomEntity } from './entities/room.entity';
import { TypeMaterialEntity } from './entities/type-material.entity';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: Number(configService.get<string>('DB_PORT', '3306')),
        username: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'we4x_si40_db'),
        entities: [
          CommentEntity,
          GameEntity,
          PaymentEntity,
          ReservationEntity,
          RoomEntity,
          TypeMaterialEntity,
          UserEntity,
        ],
        synchronize: false,
        charset: 'utf8mb4',
      }),
    }),
  ],
})
export class DatabaseModule {}
