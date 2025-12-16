import '../App.css'
import { Divider, Input } from 'antd';
import { useState } from 'react';
import CsvTable from './CsvTable'
import ChartComponent from './ChartComponent'
import ReportForecast from './ReportForecast';
import {  UserRegister } from '../api/api.js'; 
import { Form, Button, message } from 'antd';

function Register() {

  const [loading, setLoading] = useState(false);

  const handleRegister = async (values) => {
    setLoading(true);
    
    
    try {
      const response = await UserRegister(values);
      if (response.success) {
        // localStorage.setItem('user', JSON.stringify(response));
        // message.success('Пароль отправлен на почту');
        message.success(`${response.message}`);
        // window.location.href = '/'; /

        localStorage.setItem('registrationData', JSON.stringify({
        login: values.email,
        password: values.password, 
        fio: values.fio
        }));

        window.location.href = `/confirm`;
      } else {
        message.error(`${response.message}`);
      }
    } catch (error) {
      message.error('Ошибка сервера');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

    const handleLogout = () => {
    // localStorage.removeItem('user');
    window.location.href = '/auth';
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
      <h1>Регистрация</h1>
      <Form onFinish={handleRegister}>
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

        <Form.Item name="password" rules={[
          { required: true, message: 'Введите пароль' },
          { min: 6, message: 'Пароль должен содержать не менее 6 символов' }


        ]} >
          <Input.Password maxLength={25} className='input-login' placeholder="Пароль" />
        </Form.Item>

         <Form.Item
          name="fio"
          rules={[
            { required: true, message: 'Введите ФИО' },
            { min: 4, message: 'Имя должно быть не менее 4 символов' }
          ]}
        >
          <Input className='input-login' placeholder="ФИО" maxLength={40}/>
        </Form.Item>

        <Button className='input-login-button' type="primary" htmlType="submit" loading={loading} block>
          Отправить пароль
        </Button>
         <Button onClick={handleLogout} className='input-login-button' type="primary" htmlType="submit" block>
          Назад
        </Button>
        </Form>
      
    </div>
  );

}

export default Register;