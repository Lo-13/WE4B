import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ReservationsModule } from './reservations/reservations.module';
import { RoomsModule } from './rooms/rooms.module';
import { NosqlModule } from './nosql/nosql.module';
import { AdminRequestModule } from './admin-request/admin-request.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    RoomsModule,
    ReservationsModule,
    NosqlModule,
    AdminRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
