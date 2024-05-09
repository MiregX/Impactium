import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

@Schema()
export class Image {
   @Prop()
   id: string;
   @Prop()
   data: any;
   @Prop()
   type: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
