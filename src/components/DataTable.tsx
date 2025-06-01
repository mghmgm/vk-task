import React from 'react';
import { Table, Empty } from 'antd';
import type { TableItem, FieldMetadata } from '../api/types';

interface DataTableProps {
  fields: FieldMetadata[];
  items: TableItem[];
  loading: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ fields, items, loading }) => {
  const columns = fields.map(field => ({
    title: field.name,
    dataIndex: field.name,
    key: field.name,
    render: (value: any) => {
      if (value === null || value === undefined) return '-';
      if (field.type === 'date') {
        try {
          return new Date(value).toLocaleDateString();
        } catch {
          return value;
        }
      }
      if (field.type === 'boolean') return value ? 'Yes' : 'No';
      return value.toString();
    }
  }));

  return (
    <Table
      columns={columns}
      dataSource={items}
      loading={loading}
      rowKey="id"
      pagination={false}
      locale={{ emptyText: <Empty description="No data available" /> }}
      scroll={{ x: true }}
    />
  );
};

export default DataTable;
