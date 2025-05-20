import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './auth/auth.module';
// import { UsuariosModule } from './usuarios/usuarios.module';
  import { UsuariosModule } from './usuarios/module/usuarios.module';
// import { TicketsModule } from './tickets/tickets.module';
// import { ComentariosModule } from './comentarios/comentarios.module';
// import { NotificacionesModule } from './notificaciones/notificaciones.module';
// import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'TicketFlowIP'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        // Setting synchronize to false to prevent table creation conflicts
        synchronize: false,
        // Optionally enable lnogging to see more detailed SQL output
        logging: configService.get('DB_LOGGING', true),
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsuariosModule,
    // TicketsModule,
    // ComentariosModule,
    // NotificacionesModule,
    // DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}