import { Table } from 'antd';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';

const CsvTable = ({ base64Data }) => {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (!base64Data) return;

    const parseCsvFromBase64 = async () => {
      setLoading(true);
      try {
       
        const csvString = atob(base64Data);
        
        // Парсим CSV
        Papa.parse(csvString, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            if (result.data && result.data.length > 0) {
              // Создаем колонки для таблицы
              const tableColumns = Object.keys(result.data[0]).map(key => ({
                title: key,
                dataIndex: key,
                key: key,
                // Добавляем возможность скролла для длинных данных
                ellipsis: true,
                // Сортируем колонки - PartNo и Description первые
                ...(key === 'PartNo' && { fixed: 'left', width: 50 }),
                ...(key === 'Description' && { fixed: 'left', width: 50 }),
              }));
              
              setColumns(tableColumns);
              setTableData(result.data);
            }
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
          }
        });
      } catch (error) {
        console.error('Error decoding base64:', error);
      } finally {
        setLoading(false);
      }
    };

    parseCsvFromBase64();
  }, [base64Data]);

  if (!base64Data) {
    return <div>Нет данных для отображения</div>;
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h3  style={{ fontSize: '24px' }} >📊 Результаты прогноза</h3>
      <Table
        columns={columns}
        dataSource={tableData}
        loading={loading}
        scroll={{ x: 1300, y: 500 }}
        pagination={{
          pageSize: 15,
          // showSizeChanger: true,
          // showQuickJumper: true,
          showTotal: (total, range) => 
            `Записи ${range[0]}-${range[1]} из ${total}`
        }}
        size="middle"
        bordered
      />
    </div>
  );
};

export default CsvTable;