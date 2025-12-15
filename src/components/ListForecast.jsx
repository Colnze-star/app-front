import React, { useState, useEffect } from 'react';
import {downloadReportFile, downloadForecastFile, fetchUserForecasts } from '../api/api.js'; 
import { 
  Table, 
  Button, 
  Divider, 
  Typography, 
  Space, 
  message,
  Spin,
  Empty,
  Modal,
  Tag
} from 'antd';
import { 
  DownloadOutlined, 
  DeleteOutlined, 
  FileTextOutlined,
  ReloadOutlined,
  EyeOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const { Title } = Typography;


const ListForecast = ({ userId }) => {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(false);


  const handleFetchForecasts = async () => {
    if (!userId) {
      message.warning('User ID не указан');
      return;
    }
    setLoading(true);
    setForecasts([]);

    try {
      console.log('Загрузка прогнозов для пользователя:', userId);
      const result = await fetchUserForecasts(userId);
      if (result.success) {
        console.log('Полученные данные:', result.data);
        setForecasts(result.data);      
        if (result.count === 0) {
          message.info('Для этого пользователя нет прогнозов');
        }
      }     
    } catch (err) {
      console.error('Ошибка загрузки прогнозов:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchForecasts();
  }, [userId]);

  // Скачивание прогноза
  const handleDownloadForecast = async (fileName) => {
      if (!fileName) return;
      try {
        console.log(fileName);
        await downloadForecastFile(fileName);
      } catch (error) {
        console.error('Ошибка скачивания:', error);
      }
  };

  // функция для скачивания .docx файла
      const handleDownloadReport = async (forecastId, fileName) => {
      if (!fileName && !forecastId) {
        alert('Нет данных для скачивания');
        return;
      }
  
      const targetForecastId = forecastId;
      const reportName = `Отчет по ${fileName}`;
  
      if (!targetForecastId) {
        alert('ID прогноза не найден');
        return;
      }
  
      try {
        console.log('Скачивание отчета для forecastId:', targetForecastId);
        console.log('Имя файла:', reportName);
        const result = await downloadReportFile(targetForecastId, reportName);   
        if (result.success) {
          console.log('Отчет успешно скачан:', result);
        }
      } catch (error) {
        console.error('Ошибка скачивания отчета:', error);
      } 
    };


  // Определение колонок таблицы
  const columns = [
    {
      title: 'Название прогноза',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <FileTextOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
  {
    title: 'Дата создания',
    dataIndex: 'date',
    key: 'date',
    width: 180,
    align: 'center',
    render: (date) => {
      // Форматируем дату
      const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      return (
        <Space>
          <CalendarOutlined />
          <span title={date}>{formattedDate}</span>
        </Space>
      );
    },
    sorter: (a, b) => new Date(a.date) - new Date(b.date),
  },
    {
      title: 'Действия',
      key: 'actions',
      width: 250,
      align: 'center',
      render: (_, record) => (
        <Space size="small"> 
          <Button 
            type="link" 
            icon={<DownloadOutlined />} 
            onClick={() => handleDownloadForecast(record.name)}
            title="Скачать прогноз"
          >
            Скачать прогноз
          </Button>
          <Button 
            type="link"  
            icon={<DownloadOutlined />} 
           
            onClick={() => handleDownloadReport(record.id_f, record.name)}
            title="Скачать отчет"
          >
            Скачать отчет
          </Button>
        </Space>
      ),
    },
  ];



  return (
    <>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        
      }}>
        
        <Space>
            <h1>Мои прогнозы</h1>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleFetchForecasts}
            loading={loading}
          >
            Обновить
          </Button>
        </Space>
      </div>
      
      <Divider style={{ borderColor: '#213547' }} />
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p>Загрузка прогнозов...</p>
        </div>
      ) : forecasts.length === 0 ? (
        <Empty
          description="У вас пока нет сохраненных прогнозов"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={forecasts}
            loading={loading}
            pagination={{
              pageSize: 10,
            //   showSizeChanger: true,
            //   showQuickJumper: true,
              showTotal: (total) => `Всего ${total} прогнозов`,
            }}
            scroll={{ x: 1000 }}
            bordered
            size="middle"
          />
          
         
        </>
      )}
    </>
  );
};

export default ListForecast;