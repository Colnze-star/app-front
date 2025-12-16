import '../App.css'
import { Divider, Input } from 'antd';
import { useState } from 'react';
import CsvTable from './CsvTable'
import ChartComponent from './ChartComponent'
import ReportForecast from './ReportForecast';
import {  UserAuthentication } from '../api/api.js'; 
import { Form, Button, message } from 'antd';

function Authentication() {

  const [loading, setLoading] = useState(false);

  const handleAuthentication = async (values) => {
    setLoading(true);
    
    
    try {
      const response = await UserAuthentication(values);
    //   console.log(response);
      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response));
        message.success('Вход успешен!');
        window.location.href = '/'; // Перезагружаем страницу
      } else {
        message.error('Неверный логин или пароль');
      }
    } catch (error) {
      message.error('Ошибка сервера');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  
  const handleLogout = () => {
    window.location.href = '/register';
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
      <h1>Авторизация</h1>
      <Form onFinish={handleAuthentication}>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Введите email' },
            { type: 'email', message: 'Введите корректный email (например: user@example.com)' },
            {
            validator: (_, value) => {
                if (value && !value.includes('@')) {
                return Promise.reject(new Error('Email должен содержать @'));
                } 

                return Promise.resolve();
            }
            }
          ]}
          validateTrigger="onBlur"
        >
          <Input  className='input-login' placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password  className='input-login' placeholder="Пароль" />
        </Form.Item>
        
        <Button  className='input-login-button' type="primary" htmlType="submit" loading={loading} block>
          Войти
        </Button>
        <Button onClick={handleLogout} className='input-login-button' type="primary" htmlType="submit" block >
          Зарегистрироваться
        </Button>
     


      </Form>
    </div>
  );

}

export default Authentication;