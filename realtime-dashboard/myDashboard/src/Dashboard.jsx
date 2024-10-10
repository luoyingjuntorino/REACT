import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Grid2,
  Paper,
  Typography,
  MenuItem,
  Select,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
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
// 注册图表组件
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

function Dashboard() {
  const [charts, setCharts] = useState([]); // 用于存储多个图表的数据
  const [timeInterval, setTimeInterval] = useState(1); // 默认选择 1 分钟
  const [refreshInterval, setRefreshInterval] = useState(5); // 统一的刷新频率
  const [chartType, setChartType] = useState("line"); // 默认图表类型为折线图
  const [dataSet, setDataSet] = useState("energy_consumption"); // 默认数据集
  const [dialogOpen, setDialogOpen] = useState(false); // 控制对话框状态
  const [loading, setLoading] = useState(false); // 加载状态

  // 数据缺失处理
  const handleMissingData = (data) => {
    const filledData = [];
    let previousTimestamp = null;

    const expectedInterval = 6 * 1000; // 6 秒的间隔

    data.forEach((entry) => {
      const currentTime = new Date(entry._time).getTime();

      // 检查两个数据点之间的时间差距是否大于 6 秒（期望的间隔）
      if (
        previousTimestamp &&
        currentTime - previousTimestamp > expectedInterval
      ) {
        const missingTime = currentTime - previousTimestamp;

        // 计算有多少个 6 秒的间隔缺失了
        const missingPoints = Math.floor(missingTime / expectedInterval);

        // 为每个缺失的间隔插入一个 null
        for (let i = 0; i < missingPoints; i++) {
          filledData.push(null);
        }
      }

      // 添加当前的数据点
      filledData.push(entry._value);
      previousTimestamp = currentTime;
    });

    return filledData;
  };

  // 获取数据
  const fetchData = async (selectedDataSet, selectedInterval) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/data?interval=${selectedInterval}`,
        {
          headers: {
            "Cache-Control": "no-cache", // 确保不会从缓存获取
          },
        }
      );
      return response.data; // 返回获取到的数据
    } catch (error) {
      console.error("Error fetching data", error);
      return []; // 如果出错，返回空数据
    } finally {
      setLoading(false);
    }
  };

  // 动态添加图表
  const handleAddChart = async () => {
    const chartData = await fetchData(dataSet, timeInterval); // 根据选择的数据集获取数据
    setCharts((prevCharts) => [
      ...prevCharts,
      {
        id: Date.now(), // 为每个图表生成唯一的ID
        type: chartType,
        data: chartData,
        label: dataSet,
        timeInterval: timeInterval,
      },
    ]);
    setDialogOpen(false); // 关闭对话框
  };

  // 删除图表
  const handleDeleteChart = (id) => {
    setCharts((prevCharts) => prevCharts.filter((chart) => chart.id !== id));
  };

  // 自动刷新所有图表
  useEffect(() => {
    const refreshChartsData = async () => {
      // 遍历现有的图表，获取最新数据
      const updatedCharts = await Promise.all(
        charts.map(async (chart) => {
          const updatedData = await fetchData(chart.label, chart.timeInterval);
          return { ...chart, data: updatedData }; // 返回更新后的图表数据
        })
      );
      setCharts(updatedCharts);
    };

    // 设置定时器来定时刷新所有图表的数据
    const intervalId = setInterval(
      refreshChartsData,
      refreshInterval * 60 * 1000
    );

    return () => clearInterval(intervalId); // 清理定时器
  }, [refreshInterval, charts]); // 当 refreshInterval 或 charts 改变时重新设置定时器

  // 处理打开对话框
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  // 处理关闭对话框
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // 渲染单个图表
  const renderChart = (chart, index) => {
    const chartData = {
      labels: chart.data.map((d) => new Date(d._time).toLocaleTimeString()),
      datasets: [
        {
          label: chart.label,
          data: handleMissingData(chart.data),
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
    return (
      <Grid2 item xs={12} md={6} key={chart.id}>
        <Paper elevation={3} style={{ padding: 16, width: 780, height: 420 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">
              {chart.label} (Interval: {chart.timeInterval} minutes)
            </Typography>
            <IconButton onClick={() => handleDeleteChart(chart.id)}>
              <DeleteIcon />
            </IconButton>
          </div>
          <div style={{ width: "100%", height: "400px" }}>
            {chart.type === "line" ? (
              <Line data={chartData} />
            ) : (
              <Bar data={chartData} />
            )}
          </div>
        </Paper>
      </Grid2>
    );
  };

  return (
    <>
      <div style={{ padding: 20 }}>
        <Typography variant="h4" gutterBottom>
          Energy Monitoring
        </Typography>

        {/* “Add Dashboard” 按钮 */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
          sx={{ height: "50px", minWidth: "150px" }}
        >
          Add Dashboard
        </Button>

        {/* 刷新频率选择框 */}
        <FormControl
          style={{ marginLeft: 20, marginBottom: 20 }}
          sx={{ height: "50px" }}
        >
          <Select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(e.target.value)}
            sx={{ height: "50px" }}
          >
            <MenuItem value={1}>1 min</MenuItem>
            <MenuItem value={5}>5 min</MenuItem>
            <MenuItem value={10}>10 min</MenuItem>
            <MenuItem value={30}>30 min</MenuItem>
          </Select>
        </FormControl>
        {/* 刷新频率选择 */}
        {/* <Select
        value={refreshInterval}
        style={{ marginRight: 20 }}
      >
        <MenuItem value={1}>1 min</MenuItem>
        <MenuItem value={5}>5 min</MenuItem>
        <MenuItem value={10}>10 min</MenuItem>
        <MenuItem value={30}>30 min</MenuItem>
      </Select> */}
        {/* 对话框用于选择数据集和图表类型 */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle sx={{ fontWeight: "bold" }}>
            Select Data Set and Chart Type
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth style={{ marginBottom: 20 }}>
              <Typography sx={{ fontWeight: "bold" }}>Data Set</Typography>
              <Select
                value={dataSet}
                onChange={(e) => setDataSet(e.target.value)}
              >
                <MenuItem value="energy_consumption">
                  Energy Consumption
                </MenuItem>
                <MenuItem value="temperature">Temperature</MenuItem>
                <MenuItem value="humidity">Humidity</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth style={{ marginBottom: 20 }}>
              <Typography sx={{ fontWeight: "bold" }}>Chart Type</Typography>
              <Select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                <MenuItem value="line">Line Chart</MenuItem>
                <MenuItem value="bar">Bar Chart</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <Typography sx={{ fontWeight: "bold" }}>Time Interval</Typography>
              <Select
                value={timeInterval}
                onChange={(e) => setTimeInterval(e.target.value)}
              >
                <MenuItem value={1}>Last 1 minute</MenuItem>
                <MenuItem value={5}>Last 5 minutes</MenuItem>
                <MenuItem value={10}>Last 10 minutes</MenuItem>
                <MenuItem value={60}>Last 60 minutes</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddChart} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <Grid2 container spacing={3} style={{ marginTop: 20 }}>
          {charts.map((chart, index) => renderChart(chart, index))}
        </Grid2>
      </div>
    </>
  );
}

export default Dashboard;
