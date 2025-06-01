import React, { useEffect, useRef, useState } from 'react';
import { Card, Divider, Spin } from 'antd';
import DataTable from './components/DataTable';
import CreateForm from './components/CreateForm';
import { fetchItems } from './api/api';
import { detectFieldsFromItems } from './utils/fieldDetector';
import type { FieldMetadata, TableItem } from './api/types';

const pageSize = 5;

const App: React.FC = () => {
  const [fields, setFields] = useState<FieldMetadata[]>([]);
  const [items, setItems] = useState<TableItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const loadData = async (pageToLoad: number) => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setLoading(true);

    try {
      const { data, total } = await fetchItems(pageToLoad, pageSize);
      setItems((prev) => [...prev, ...data]);
      setTotal(total);

      if (data.length > 0 && fields.length === 0) {
        setFields(detectFieldsFromItems(data));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container || loading) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const nearBottom = scrollTop + clientHeight >= scrollHeight - 50;

      if (nearBottom && items.length < total) {
        setPage((prev) => {
          const nextPage = prev + 1;
          const nextItemCount = nextPage * pageSize;
          if (nextItemCount <= total) return nextPage;
          return prev;
        });
      }
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);

    return () => container?.removeEventListener('scroll', handleScroll);
  }, [items, total]);

  const handleItemCreated = (newItem: TableItem) => {
    setItems((prev) => [newItem, ...prev]);

    const newFields = Object.keys(newItem).filter(
      (key) => key !== 'id' && !fields.some((f) => f.name === key),
    );

    if (newFields.length > 0) {
      setFields((prev) => [
        ...prev,
        ...newFields.map((name) => ({
          name,
          type: 'string' as const,
          options: undefined,
        })),
      ]);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card title="Create New Item" style={{ marginBottom: '24px' }}>
        {fields.length > 0 ? (
          <CreateForm onItemCreated={handleItemCreated} fields={fields} />
        ) : (
          <Spin tip="Preparing form..." />
        )}
      </Card>

      <Divider />

      <Card title="Items Table">
        <div ref={containerRef} style={{ maxHeight: '500px', overflowY: 'auto', padding: '16px' }}>
          <DataTable fields={fields} items={items} loading={loading} />
          {loading && (
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <Spin />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default App;
