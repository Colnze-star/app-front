import React, { useState, useMemo, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ScatterChart, 
  Scatter, ZAxis 
} from 'recharts';
import { Row, Col, Card, Select, Typography } from 'antd';

const { Title } = Typography;
const { Option } = Select;

// Выносим вспомогательные функции вне компонента
const getRussianDayName = (englishDay) => {
  const daysMap = {
    'Monday': 'Понедельник',
    'Tuesday': 'Вторник',
    'Wednesday': 'Среда',
    'Thursday': 'Четверг',
    'Friday': 'Пятница',
    'Saturday': 'Суббота',
    'Sunday': 'Воскресенье'
  };
  return daysMap[englishDay] || englishDay;
};

// Цвета для диаграмм
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
const HEATMAP_COLORS = ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'];

const ChartComponent = ({ base64Data }) => {
  const [chartType, setChartType] = useState('line');
  const [parsedData, setParsedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Парсим данные из base64
  useEffect(() => {
    if (!base64Data) {
      setParsedData([]);
      return;
    }

    const parseData = async () => {
      setIsLoading(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const csvString = atob(base64Data);
        const lines = csvString.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          setParsedData([]);
          return;
        }

        const headers = lines[0].split(';').map(h => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(';').map(v => v.trim());
          const item = {};

          headers.forEach((header, index) => {
            if (values[index] !== undefined) {
              const value = values[index];
              
              if (header === 'Sales_forecast_kg') {
                item[header] = parseFloat(value.replace(',', '.')) || 0;
              } else {
                item[header] = value;
              }
            }
          });

          if (item.Date) {
            data.push(item);
          }
        }

        setParsedData(data);
      } catch (error) {
        console.error('Error parsing data:', error);
        setParsedData([]);
      } finally {
        setIsLoading(false);
      }
    };

    parseData();
  }, [base64Data]);

  // Получаем информацию о товаре (предполагаем только один товар)
  const productInfo = useMemo(() => {
    if (parsedData.length === 0) return null;
    const firstItem = parsedData[0];
    return {
      productName: firstItem.Product || 'Товар',
      totalSales: parsedData.reduce((sum, item) => sum + (item.Sales_forecast_kg || 0), 0)
    };
  }, [parsedData]);

  // Группируем данные по датам
  const productData = useMemo(() => {
    if (parsedData.length === 0) return [];

    return parsedData.map(item => ({
      date: item.Date,
      // Форматируем дату в DD.MM.YYYY
      name: new Date(item.Date).toLocaleDateString('ru-RU'),
      sales: item.Sales_forecast_kg,
      dayOfWeek: item['Day of week'],
      fullDate: item.Date,
      // Для heatmap
      dayNumber: new Date(item.Date).getDate(),
      weekNumber: Math.floor(new Date(item.Date).getDate() / 7) + 1,
      salesFormatted: Math.round(item.Sales_forecast_kg * 100) / 100
    })).sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));
  }, [parsedData]);

  // Данные по дням недели (доля от общего объема)
  const dayOfWeekShareData = useMemo(() => {
    if (parsedData.length === 0) return [];
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const result = [];
    const totalSales = parsedData.reduce((sum, item) => sum + (item.Sales_forecast_kg || 0), 0);

    days.forEach(day => {
      const dayData = parsedData.filter(item => item['Day of week'] === day);
      const daySales = dayData.reduce((sum, item) => sum + (item.Sales_forecast_kg || 0), 0);
      const share = totalSales > 0 ? (daySales / totalSales) * 100 : 0;
      
      result.push({
        name: getRussianDayName(day),
        share: Math.round(share * 100) / 100,
        sales: Math.round(daySales * 100) / 100,
        count: dayData.length
      });
    });

    return result;
  }, [parsedData]);

  // Данные для средних продаж по дням недели
  const dayOfWeekAverageData = useMemo(() => {
    if (parsedData.length === 0) return [];
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const result = [];

    days.forEach(day => {
      const dayData = parsedData.filter(item => item['Day of week'] === day);
      const totalSales = dayData.reduce((sum, item) => sum + (item.Sales_forecast_kg || 0), 0);
      const avgSales = dayData.length > 0 ? totalSales / dayData.length : 0;
      
      result.push({
        name: getRussianDayName(day),
        average: Math.round(avgSales * 100) / 100,
        total: Math.round(totalSales),
        count: dayData.length
      });
    });

  return result;
}, [parsedData]);


  if (isLoading) {
    return <div>Загрузка данных...</div>;
  }

  if (!base64Data) {
    return <div>Нет данных для построения диаграмм</div>;
  }

  if (parsedData.length === 0) {
    return <div>Не удалось загрузить данные</div>;
  }

  const currentProduct = productInfo?.productName || 'Товар';

  return (
    <div style={{ marginTop: '20px' }}>
      <Title level={3}>📈 Визуализация прогноза продаж</Title>
      
      {/* Контролы для управления */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card size="small">
            <div>Прогнозируемый товар:</div>
            <div style={{ 
              padding: '8px', 
              marginTop: '8px', 
              backgroundColor: '#f0f2f5',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>
              {currentProduct}
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <div>Тип диаграммы:</div>
            <Select 
              style={{ width: '100%', marginTop: 8 }}
              value={chartType}
              onChange={setChartType}
              disabled={isLoading}
            >
              <Option value="line">Линейная</Option>
              <Option value="bar">Столбчатая</Option>
              <Option value="area">Областная</Option>
            </Select>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <div>Статистика:</div>
            <div style={{ marginTop: 8 }}>
             <strong>Записей:</strong> {parsedData.length}
              <br />
              <strong>Общий объем:</strong> {Math.round(productInfo?.totalSales || 0)} кг 
              <br />
              <strong>Период:</strong> {parsedData.length > 0 ? 
                `${new Date(parsedData[0].Date).toLocaleDateString('ru-RU')} - 
                 ${new Date(parsedData[parsedData.length-1].Date).toLocaleDateString('ru-RU')}` : 
                'Н/Д'}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Диаграмма продаж */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title={`📊 Прогноз продаж: ${currentProduct}`}
            size="small"
            loading={isLoading}
          >
            {productData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                {chartType === 'line' ? (
                  <LineChart data={productData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={Math.floor(productData.length / 25)} // Показываем только каждую 10-ю метку
                    />
                    <YAxis label={{ value: 'Кг', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value) => [`${value} кг`, 'Прогноз продаж']}
                      labelFormatter={(label) => `Дата: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#8884d8" 
                      name="Прогноз продаж (кг)"
                      strokeWidth={2}
                      dot={{ fill: '#8884d8', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                ) : chartType === 'bar' ? (
                  <BarChart data={productData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={Math.floor(productData.length / 10)}
                    />
                    <YAxis label={{ value: 'Кг', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value) => [`${value} кг`, 'Прогноз продаж']}
                      labelFormatter={(label) => `Дата: ${label}`}
                    />
                    <Legend />
                    <Bar 
                      dataKey="sales" 
                      name="Прогноз продаж (кг)" 
                      fill="#82ca9d" 
                    />
                  </BarChart>
                ) : (
                  <AreaChart data={productData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={Math.floor(productData.length / 10)}
                    />
                    <YAxis label={{ value: 'Кг', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value) => [`${value} кг`, 'Прогноз продаж']}
                      labelFormatter={(label) => `Дата: ${label}`}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#ffc658" 
                      fill="#ffc658" 
                      name="Прогноз продаж (кг)"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div>Нет данных</div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Доля от общего объема по дням недели и тепловая карта */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>

      <Col span={12}>
        <Card title="📈 Средние продажи по дням недели" size="small" loading={isLoading}>
          {dayOfWeekAverageData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dayOfWeekAverageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Кг', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'average') return [`${value} кг`, 'Средние продажи'];
                    return [`${value} кг`, name];
                  }}
                  labelFormatter={(label) => `День: ${label}`}
                />
                <Legend />
                <Bar dataKey="average" name="Средние продажи" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div>Нет данных</div>
          )}
        </Card>
      </Col>

        <Col span={12}>
          <Card title="🥧 Доля продаж по дням недели" size="small" loading={isLoading}>
            {dayOfWeekShareData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dayOfWeekShareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="share"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    nameKey="name"
                  >
                    {dayOfWeekShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => {
                      const sales = props.payload.sales;
                      return [
                        `${value}% (${sales} кг)`,
                        'Доля от общего объема'
                      ];
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div>Нет данных</div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChartComponent;