import type { TableItem } from './types';

const API_URL = 'http://localhost:3001/items';

export const fetchItems = async (page: number, pageSize: number) => {
  const response = await fetch(`${API_URL}?_page=${page}&_limit=${pageSize}&_sort=id`);
  const data = await response.json();

  const totalHeader = response.headers.get('X-Total-Count');
  const total = totalHeader ? Number(totalHeader) : 0;

  return { data, total };
};


export const createItem = async (item: Omit<TableItem, 'id'>): Promise<TableItem> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
  return response.json();
};