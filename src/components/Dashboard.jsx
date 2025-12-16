import React from 'react';
import { Button, Card } from 'antd';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log(user);


  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/auth';
  };

  return (
    <div style={{ padding: 20 }}>
      <Card title="Добро пожаловать!">
        <p>ID: {user.data.id_u}</p>
        <p>Email: {user.data.login}</p>
        <p>ФИО: {user.data.fio}</p>
        
        <Button type="primary" danger onClick={handleLogout}>
          Выйти
        </Button>
      </Card>
    </div>
  );
};

export default Dashboard;