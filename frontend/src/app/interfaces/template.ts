import { TemplateExercises } from './template-exercises';

export interface Template {
  idtemplate: number;
  name: string;
  description: string;
  type: string;
  exercises: TemplateExercises[];
}
