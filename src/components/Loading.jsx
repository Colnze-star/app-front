import '../App.css'
import { Divider, Input } from 'antd';
import { useState } from 'react';
import CsvTable from './CsvTable'
import ChartComponent from './ChartComponent'
import ReportForecast from './ReportForecast';
import { downloadForecastFile, uploadForecastFile } from '../api/api.js'; 

function Loading() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null); 

  const userId=45;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadResult(null); 
  };

  // функция для загрузки файла 
  const handleFileLoading = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert('Выберите файл!');
      return;
    }
    
    setUploading(true);
    setUploadResult(null); 

    try {
      const result = await uploadForecastFile(file);   
      if (result.success) {
        console.log('Файл успешно загружен:', result.data);
        setUploadResult(result.data);
      }   
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setUploadResult({ error: error.message });     
    } finally {
      setUploading(false);
    }
  };

  // функция для скачивания файла
  const handleDownloadForecast = async () => {
      if (!uploadResult) return;
      try {
        const fileName = uploadResult.f.name;
        console.log(fileName);
        await downloadForecastFile(fileName);
      } catch (error) {
        console.error('Ошибка скачивания:', error);
      }
  };


  return (
    <>
      <h1>Предиктивный анализ спроса</h1>
      <Divider style={{ borderColor: '#213547' }} />
      <div className="input-file">
        <form onSubmit={handleFileLoading}>
          <input
            type="file"
            onChange={handleFileChange}
            encType="multipart/form-data"
            accept=".csv"
            id="file-input"
          />  
          <div className='loading-bth'>
            <label htmlFor="file-input" className="input-file-btn">Выберите файл</label>           
            <label>Расширение .csv</label>
          </div> 
          {file && <p>Выбран файл: {file.name}</p>}
            <p>
                <button className='button-dark-download' type="submit">
                  {uploading ? 'Загрузка...' : 'Загрузить файл'}
                </button>
            </p>        
        </form>

        {uploadResult && (
          <div className='file-result-flag'>
            <h4>Файл успешно обработан</h4>
          </div>
        )}
      </div>

      <Divider style={{ borderColor: '#213547' }} />

      {uploadResult && uploadResult.resultFile && (
        <div style={{ marginTop: '20px' }}>
          <CsvTable base64Data={uploadResult.resultFile} />
        </div>
      )}
     
      <h5 className='label-download-forecast' >Скачать прогноз</h5>

      {uploadResult ? (
        <>
        <Divider style={{ borderColor: '#213547' }} />
         <button className='button-dark-download' onClick={handleDownloadForecast}> Скачать файл прогноза </button>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              Будет скачан файл: {uploadResult.f.outputfilename || 'forecast_result'}
            </p>
        </>
      ) : (
        <div>
          <p style={{ color: '#999' }}>Загрузите файл для получения прогноза</p>
        </div>
      )}

      <Divider style={{ borderColor: '#213547' }} />

      {/* графики */}
      {uploadResult?.resultFile && (
        <div>
          <ChartComponent base64Data={uploadResult.resultFile} />
          <Divider style={{ borderColor: '#213547' }} />  
          <ReportForecast userId={userId} forecastId={uploadResult.f.id_f} />
          <Divider style={{ borderColor: '#213547' }} />
        </div>
      )}
    </>


      
  )
}

export default Loading;