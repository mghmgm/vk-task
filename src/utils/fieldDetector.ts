import type { TableItem, FieldMetadata, FieldType } from '../api/types';

export const detectFieldsFromItems = (items: TableItem[]): FieldMetadata[] => {
  if (items.length === 0) return [];

  const sampleItem = items[0];
  const fields: FieldMetadata[] = [];
  const fieldOptions: Record<string, Set<string>> = {};

  items.forEach(item => {
    Object.keys(item).forEach(key => {
      if (key === 'id') return;
      
      if (!fieldOptions[key]) {
        fieldOptions[key] = new Set();
      }
      if (item[key] !== null && item[key] !== undefined) {
        fieldOptions[key].add(item[key].toString());
      }
    });
  });

  Object.keys(sampleItem).forEach(key => {
    if (key === 'id') return;

    const value = sampleItem[key];
    let type: FieldType = 'string';
    let options: string[] | undefined;

    if (typeof value === 'number') {
      type = 'number';
    } else if (typeof value === 'boolean') {
      type = 'boolean';
    } else if (value instanceof Date || !isNaN(Date.parse(value))) {
      type = 'date';
    } else if (fieldOptions[key]?.size <= 5) {
      type = 'select';
      options = Array.from(fieldOptions[key]);
    }

    fields.push({ name: key, type, options });
  });

  return fields;
};