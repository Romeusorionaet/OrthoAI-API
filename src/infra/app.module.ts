import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "./http/http.module";
import { envSchema } from "./env/env";
import { EnvModule } from "./env/env.module";
import { ServicesModule } from "./services/services.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    HttpModule,
    EnvModule,
    ServicesModule,
  ],
})
export class AppModule {}
