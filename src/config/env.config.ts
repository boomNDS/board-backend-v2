import { plainToInstance } from "class-transformer"
import { IsEnum, IsNumber, IsString, validateSync } from "class-validator"
import { Environment } from "./environment.enum"

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment
  @IsNumber()
  PORT: number
  @IsString()
  DATABASE_URL: string
  @IsString()
  JWT_SECRET: string
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }

  return validatedConfig
}
