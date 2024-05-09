import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateImageDto {
    @IsString()
    @MaxLength(32)
    @IsNotEmpty()
    readonly id: string;
    
    @IsNotEmpty()
    readonly data: any;

    @IsString()
    @MaxLength(5)
    @IsNotEmpty()
    readonly type: string;
};

export class UpdateImageDto extends PartialType(CreateImageDto) {};