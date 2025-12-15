import '../App.css'
import { Divider } from 'antd';
import { useState } from 'react';
import { CreateReport, downloadReportFile } from '../api/api.js'; 

const ReportForecast = ({ userId, forecastId }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null); 


  // функция для создания файла .doxc
  const handleCreateReport = async (e) => {
    e.preventDefault();

    if (!userId || !forecastId) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    
    setUploading(true);
    setUploadResult(null);

    try {
      console.log('Отправка запроса с userId:', userId, 'forecastId:', forecastId);

      const result = await CreateReport(userId, forecastId);
      
      if (result.success) {
        console.log('Отчет успешно создан:', result.data);
        setUploadResult(result.data);
        // alert('Отчет успешно создан!');
      }
      
    } catch (error) {
      console.error('Ошибка создания отчета:', error);
      alert(`Ошибка создания отчета: ${error.message}`);
      
    } finally {
      setUploading(false);
    }
  };
    

    // функция для скачивания .docx файла
    const handleDownloadReport = async () => {
    if (!uploadResult && !forecastId) {
      alert('Нет данных для скачивания');
      return;
    }

    const targetForecastId = forecastId;
    const fileName = `Отчет по ${uploadResult.forecast.name}`;

    if (!targetForecastId) {
      alert('ID прогноза не найден');
      return;
    }

    try {
      console.log('Скачивание отчета для forecastId:', targetForecastId);
      console.log('Имя файла:', fileName);
      const result = await downloadReportFile(targetForecastId, fileName);   
      if (result.success) {
        console.log('Отчет успешно скачан:', result);
      }
    } catch (error) {
      console.error('Ошибка скачивания отчета:', error);
    } 
  };
    
    return (
        <>

        {/* скачивание отчета */}

       <h5 className='label-download-forecast'>Создать и скачать отчет</h5>      

        {forecastId ? (
            <>
                <Divider style={{ borderColor: '#213547' }} />
                
                {uploadResult ? (
                    
                    <div>
                        <div className='file-result-flag'>
                            <h4>Файл успешно обработан</h4>
                        </div>
                        <br />
                        <button className='button-dark-download' onClick={handleDownloadReport}>
                            Скачать файл прогноза
                        </button>
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                            Будет скачан файл: {`Отчет по ${uploadResult.forecast.name} `}
                        </p>
                    </div>
                ) : (
                   
                    <button className='button-dark-download' onClick={handleCreateReport}> 
                        {uploading ? 'Создание...' : 'Создать отчет'}
                    </button>
                )}
            </>
        ) : (
            <div>
                <p style={{ color: '#999' }}>Ошибка, невозможно создать отчет</p>
            </div>
        )}


        </>
    );
    
};


export default ReportForecast;