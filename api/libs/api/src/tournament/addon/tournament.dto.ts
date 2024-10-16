import { DisplayName, Identifier, λError } from "@impactium/pattern";
import { IsNotEmpty, Matches } from "class-validator";
import { TournamentEntity } from "./tournament.entity";

export class CreateTournamentDto {
  @IsNotEmpty()
  @Matches(Identifier.Code, {
    message: λError.indent_invalid_format
  })
  code!: TournamentEntity['code'];

  @IsNotEmpty()
  @Matches(DisplayName.base, {
    message: λError.username_invalid_format
  })
  title!: TournamentEntity['title'];
}

