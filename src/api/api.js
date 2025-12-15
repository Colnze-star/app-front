import axios from 'axios'; 

const API_BASE_URL = 'http://localhost:4010';

// Создаем экземпляр axios для удобства 
const apiForecast = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': 'Bearer mock-token-12345',
    'Content-Type': 'application/json'
  }
});

// Функция для загрузки файла
export const uploadForecastFile = async (file, userId) => {
  const formData = new FormData();
  formData.append('file', file);
   formData.append('id_u', userId);

  try {
    const response = await apiForecast.post('/forecast/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    
    console.log('Файл загружен:', response.data);
    return { success: true, data: response.data };
    
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    
    // Обработка ошибок axios
    if (error.response) {
      // Сервер ответил с кодом ошибки
      const errorMessage = error.response.data?.message || 
                          error.response.statusText || 
                          'Неизвестная ошибка сервера';
      throw new Error(`Ошибка сервера ${error.response.status}: ${errorMessage}`);
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      throw new Error('Нет ответа от сервера. Проверьте подключение.');
    } else {
      // Ошибка при настройке запроса
      throw new Error(`Ошибка запроса: ${error.message}`);
    }
  }
};

// Функция для скачивания файла прогноза
export const downloadForecastFile = async (fileName) => {
  try {
    const response = await apiForecast.get(`/forecast/download/${fileName}`, {
      responseType: 'blob' 
    });

    if (response.status === 200) {
      // Создаем URL для скачивания
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Очистка
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      return { success: true };
    } else {
      throw new Error('Ошибка при скачивании файла');
    }
  } catch (error) {
    console.error('Ошибка скачивания:', error);
    throw error;
  }
};

export const CreateReport = async (userId, forecastId) => {
    
    console.log(userId);
    console.log(forecastId);

    try {
        const response = await apiForecast.post(`/report/create/${userId}/${forecastId}`);
        console.log('Отчет создан:', response.data);
        return { 
        success: true, 
        data: response.data,
        message: 'Отчет успешно создан'
        };
    
    } catch (error) {
    console.error('Ошибка создания отчета:', error);
    // Обработка ошибок axios
    if (error.response) {
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error ||
                          error.response.statusText || 
                          'Неизвестная ошибка сервера';
      throw new Error(`Ошибка сервера ${error.response.status}: ${errorMessage}`);
    } else if (error.request) {
      throw new Error('Нет ответа от сервера. Проверьте подключение.');
    } else {
      throw new Error(`Ошибка запроса: ${error.message}`);
    }
  }
};

export const downloadReportFile = async (forecastId, fileName = 'report.docx') => {
  try {
    const response = await apiForecast.get(`/report/download/${forecastId}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/octet-stream'
      }
    });

    if (response.status === 200) {

    // Проверяем тип файла
    const contentType = response.headers['content-type'];
    const expectedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/octet-stream',
      'application/msword'
    ];
    if (!expectedTypes.some(type => contentType?.includes(type))) {
      console.warn('Неожиданный тип файла:', contentType);
    }

    // Создаем объект Blob
    const blob = new Blob([response.data], {
      type: contentType || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    // Создаем URL для скачивания
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.endsWith('.docx') ? fileName : `${fileName}.docx`;
    link.style.display = 'none';
    
    // Добавляем в DOM и кликаем
    document.body.appendChild(link);
    link.click();

      // Очистка
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      return { success: true };
    } else {
      throw new Error('Ошибка при скачивании файла');
    }
  } catch (error) {
    console.error('Ошибка скачивания:', error);
    throw error;
  }
};

// Функция для получения прогнозов пользователя
export const fetchUserForecasts = async (userId) => {
  try {
    console.log(`Загрузка прогнозов для пользователя: ${userId}`);
    
    const response = await apiForecast.get(`/forecast/user/${userId}`);
    
    console.log('Прогнозы получены:', response.data);
    return { 
      success: true, 
      data: response.data || [],
      count: Array.isArray(response.data) ? response.data.length : 0
    };
    
  } catch (error) {
    console.error('Ошибка загрузки прогнозов:', error);
    
    if (error.response) {
      const status = error.response.status;
      let message = 'Ошибка при загрузке прогнозов';
      throw new Error(`${message} (код: ${status})`);
    } else if (error.request) {
      throw new Error('Нет ответа от сервера. Проверьте подключение.');
    } else {
      throw new Error(`Ошибка запроса: ${error.message}`);
    }
  }
};

// Экспортируем все нужные API методы
export default { downloadForecastFile, uploadForecastFile, CreateReport, downloadReportFile, fetchUserForecasts};