import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Grid,
  Paper,
  Typography,
  MenuItem,
  Select,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// 注册所有必要的图表组件
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Dashboardv2() {
  const [data, setData] = useState([]);
  const [timeInterval, setTimeInterval] = useState(1); // 默认选择 1 分钟
  const [refreshInterval, setRefreshInterval] = useState(5); // 自动刷新频率默认设置为 5 分钟
  const [chartType, setChartType] = useState("line"); // 默认图表类型为折线图
  const [dataType, setDataType] = useState("energy_consumption"); // 默认显示的数据类型
  const [lastUpdated, setLastUpdated] = useState(null);

  // 处理缺失数据，插入 null 值
  const handleMissingData = (data) => {
    const filledData = [];
    let previousTimestamp = null;
    const expectedInterval = 5 * 1000; // 5 秒的间隔

    data.forEach((entry) => {
      const currentTime = new Date(entry._time).getTime();
      if (
        previousTimestamp &&
        currentTime - previousTimestamp > expectedInterval
      ) {
        const missingPoints = Math.floor(
          (currentTime - previousTimestamp) / expectedInterval
        );
        for (let i = 0; i < missingPoints; i++) {
          filledData.push(null);
        }
      }
      filledData.push(entry._value);
      previousTimestamp = currentTime;
    });

    return filledData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 发送选择的数据类型和时间间隔到后端
        const response = await axios.get(
          `http://localhost:3001/api/data?interval=${timeInterval}&type=${dataType}`
        );
        setData(response.data);
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, refreshInterval * 60000);
    return () => clearInterval(intervalId);
  }, [timeInterval, refreshInterval, dataType]);

  // 获取图表数据
  const chartData = {
    labels: data.map((d) => new Date(d._time).toLocaleTimeString()),
    datasets: [
      {
        label: `${dataType.replace("_", " ")} (kW)`,
        data: handleMissingData(data),
        borderColor: "rgba(0, 200, 0, 1)",
        backgroundColor: "rgba(0, 200, 0, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        spanGaps: false,
      },
    ],
  };

  // 选择折线图或柱状图
  const renderChart = () => {
    if (chartType === "line") {
      return <Line data={chartData} />;
    } else if (chartType === "bar") {
      return <Bar data={chartData} />;
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Energy Monitoring
      </Typography>

      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        {/* 时间间隔选择 */}
        <FormControl style={{ marginRight: 20 }}>
          <InputLabel id="time-interval-label">Time Interval</InputLabel>
          <Select
            labelId="time-interval-label"
            value={timeInterval}
            onChange={(e) => setTimeInterval(e.target.value)}
          >
            <MenuItem value={1}>Last 1 minute</MenuItem>
            <MenuItem value={5}>Last 5 minutes</MenuItem>
            <MenuItem value={10}>Last 10 minutes</MenuItem>
          </Select>
        </FormControl>

        {/* 刷新频率选择 */}
        <FormControl style={{ marginRight: 20 }}>
          <InputLabel id="refresh-interval-label">Refresh Interval</InputLabel>
          <Select
            labelId="refresh-interval-label"
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(e.target.value)}
          >
            <MenuItem value={1}>1 min</MenuItem>
            <MenuItem value={5}>5 min</MenuItem>
          </Select>
        </FormControl>

        {/* 数据类型选择 */}
        <FormControl style={{ marginRight: 20 }}>
          <InputLabel id="data-type-label">Data Type</InputLabel>
          <Select
            labelId="data-type-label"
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
          >
            <MenuItem value="energy_consumption">Energy Consumption</MenuItem>
            <MenuItem value="temperature">Temperature</MenuItem>
            <MenuItem value="humidity">Humidity</MenuItem>
          </Select>
        </FormControl>

        {/* 图表类型选择 */}
        <FormControl style={{ marginRight: 20 }}>
          <InputLabel id="chart-type-label">Chart Type</InputLabel>
          <Select
            labelId="chart-type-label"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <MenuItem value="line">Line Chart</MenuItem>
            <MenuItem value="bar">Bar Chart</MenuItem>
          </Select>
        </FormControl>

        {/* 手动刷新按钮 */}
        <Button variant="contained" onClick={() => setLastUpdated(new Date())}>
          Refresh
        </Button>

        {/* 显示最后更新时间 */}
        {lastUpdated && (
          <Typography style={{ marginLeft: 20 }}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Typography>
        )}
      </div>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h6">
              Last {dataType.replace("_", " ")}:{" "}
              {data.length > 0
                ? data[data.length - 1]._value.toFixed(2)
                : "N/A"}{" "}
              kW
            </Typography>
            {/* 动态渲染图表 */}
            {renderChart()}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboardv2;
