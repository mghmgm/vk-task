export interface TableItem {
  id: string;
  [key: string]: any;
}

export type FieldType = 'string' | 'number' | 'date' | 'boolean' | 'select';

export interface FieldMetadata {
  name: string;
  type: FieldType;
  options?: string[];
}