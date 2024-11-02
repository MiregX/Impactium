import { DisplayName, Identifier, λError, λIteration, λIterations } from "@impactium/pattern";
import { IsBooleanString, isBooleanString, IsDate, IsEnum, IsJSON, IsNotEmpty, IsObject, IsOptional, IsString, Matches } from "class-validator";
import { TournamentEntity } from "./tournament.entity";

export class CreateTournamentDto {
  @IsNotEmpty()
  @Matches(Identifier.Code, {
    message: λError.code_invalid_format
  })
  code!: TournamentEntity['code'];

  @IsNotEmpty()
  @Matches(DisplayName.base, {
    message: λError.indent_invalid_format
  })
  title!: TournamentEntity['title'];

  @IsNotEmpty()
  @IsEnum(λIterations, {
    message: λError.tournament_iterations_invalid_format
  })
  iterations!: λIteration;

  @IsOptional()
  @IsNotEmpty()
  @IsBooleanString()
  has_lower_bracket!: string;

  @IsNotEmpty()
  @IsJSON()
  settings!: string;

  @IsNotEmpty()
  @IsDate()
  start!: TournamentEntity['start'];

  @IsOptional()
  @IsString()
  description?: TournamentEntity['description'];

  @IsOptional()
  @IsString()
  rules?: TournamentEntity['rules'];
}

export class UpdateTournamentDto {}
