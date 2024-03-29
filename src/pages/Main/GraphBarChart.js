import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const GraphBarChart = ({ data }) => {
  const transformedData = [];

  for (let month = 1; month <= 12; month++) {
    const monthName = month + '월';
    const income = data.INCOME[monthName];
    const spending = data.SPENDING[monthName];

    const newData = {
      name: monthName,
      수입: income,
      지출: spending,
    };

    transformedData.push(newData);
  }

  const tickFormatY = (tickItem) => tickItem.toLocaleString();

  return (
    <BarChart
      width={580}
      height={280}
      data={transformedData}
      margin={{
        top: 25,
        right: 10,
        left: 40,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis tickFormatter={tickFormatY} />
      <Tooltip />
      <Legend />
      <Bar
        dataKey="수입"
        fill="#8884d8"
        position="top"
        formatter={(value) => new Intl.NumberFormat('ko-KR').format(value)}
      />

      <Bar
        dataKey="지출"
        fill="#82ca9d"
        position="top"
        formatter={(value) => new Intl.NumberFormat('ko-KR').format(value)}
      />
    </BarChart>
  );
};

export default GraphBarChart;
