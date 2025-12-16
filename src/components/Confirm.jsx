import '../App.css'
import { Divider, Input } from 'antd';
import { useState } from 'react';
import {  UserConfirm } from '../api/api.js'; 
import { Form, Button, message } from 'antd';


function Confirm() {

  const [loading, setLoading] = useState(false);
  const data = localStorage.getItem('registrationData');
  const parsedData = JSON.parse(data);
  // console.log(parsedData.login);

  // message.success('Код подтверждения отправлен на почту');

  const handleConfirm = async (values) => {
    setLoading(true);
    const data = [
      {login: parsedData.login,
        password: parsedData.password,
        fio: parsedData.fio,
        code: values.code
      }
    ]
    try {
      
      const response = await UserConfirm(data);
      console.log(response.data);
      if (response.success) {
        localStorage.removeItem('registrationData');
        localStorage.setItem('user', JSON.stringify(response));
        console.log(response.data);
        window.location.href = '/';
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
    window.location.href = '/register';
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
      <h1>Подтверждение почты</h1>
      <Form onFinish={handleConfirm}>

         <Form.Item
          name="code"
          rules={[
            { required: true, message: 'Введите код с почты' },
            { min: 6, message: 'Код должен содержать 6 цифр' },
            { max: 6, message: 'Код должен содержать 6 цифр' },
            { pattern: /^\d{6}$/, message: 'Вводите цифры'}
          ]}
        >
          <Input 
            className='input-login' 
            placeholder="Код подтверждения" 
            maxLength={6}
          />
        </Form.Item>

        <Button className='input-login-button' type="primary" htmlType="submit" loading={loading} block>
          Подтвердить почту
        </Button>
        <Button onClick={handleLogout} className='input-login-button' type="primary" htmlType="submit" block>
          Назад
        </Button>
        </Form>
      
    </div>
  );

}

export default Confirm;