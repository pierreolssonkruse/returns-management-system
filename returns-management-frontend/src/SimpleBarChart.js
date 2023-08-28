import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

function SimpleBarChart({ data, dataKey }) {
  return (
    <BarChart width={400} height={400} data={data}>
      <XAxis dataKey={dataKey} />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#8884d8" />
    </BarChart>
  );
}

export default SimpleBarChart;
