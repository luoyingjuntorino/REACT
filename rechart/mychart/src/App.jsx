import React, { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";

function App() {
  const [threshold, setThreshold] = useState(3000); // 阈值初始值

  const data = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  ];

  // 更新阈值的处理函数
  const handleThresholdChange = (e) => {
    setThreshold(Number(e.target.value));
  };

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <h1>Threshold Line Chart</h1>

      {/* 用户输入的阈值控制 */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="threshold">Set Threshold: </label>
        <input
          id="threshold"
          type="number"
          value={threshold}
          onChange={handleThresholdChange}
        />
      </div>

      {/* 图表部分 */}
      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />

          {/* 阈值线 */}
          <ReferenceLine
            y={threshold}
            label={`Threshold (${threshold})`}
            stroke="red"
            strokeDasharray="3 3"
          />

          {/* 图表中的折线 */}
          <Line
            type="monotone"
            dataKey="pv"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;
