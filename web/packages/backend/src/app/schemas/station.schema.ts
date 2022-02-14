import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypeOptions} from 'mongoose';
import {locationSchema } from './location.schema'
import { textSchema } from './text.schema';
import { horaireSchema } from './horaire.schema';
import { serviceSchema } from './service.schema';


@Schema()
export class Station extends Document<string> {

  @Prop()
  _id?:string

  @Prop()
  coordinates?:[number]

  @Prop()
  horaires?: horaireSchema

  @Prop()
  _attributes?: locationSchema

  @Prop()
  adresse?:textSchema

  @Prop()
  ville?: textSchema

  @Prop()
  services?: serviceSchema

  @Prop()
  prix?: [{
        _attributes: {
            nom: string,
            id: string,
            maj: string,
            valeur: string
        }
    }]

  @Prop()
  rupture ?: [{
    _attributes: {
        id: string,
        nom: string,
        debut: string,
        fin: string
    }
}]
}

export const StationSchema = SchemaFactory.createForClass(Station);

