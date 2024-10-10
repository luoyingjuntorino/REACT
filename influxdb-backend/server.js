const express = require("express");
const { InfluxDB } = require("@influxdata/influxdb-client");
const cors = require("cors");

const app = express();
const port = 3001;

// InfluxDB 配置
const token =
  "BYsgwMWPgvK57UJX3IAfJBXIsa45ELbBAd4eKKLAYpHYtn06JW8trCthh_oR6gTZv9ve-P-bBHBDeFXbD8K7ig=="; // 替换为你的 InfluxDB API token
const org = "Polito"; // 替换为你的组织名
const bucket = "test"; // 替换为你的 bucket 名
const url = "http://localhost:8086"; // 如果你在本地运行 InfluxDB

const client = new InfluxDB({ url, token });
app.use(cors());

// 查询 InfluxDB 数据的 API 路由
app.get("/api/data", async (req, res) => {
  const { interval } = req.query;
  console.log("Received interval:", interval); // 调试日志

  // 将时间间隔转换为 InfluxDB 查询中的范围
  let timeRange;
  if (interval === "1") {
    timeRange = "-1m"; // 1 分钟
  } else if (interval === "5") {
    timeRange = "-5m"; // 5 分钟
  } else if (interval === "10") {
    timeRange = "-10m"; // 10 分钟
  } else if (interval === "30") {
    timeRange = "-30m"; // 30 分钟
  } else if (interval == "60") {
    timeRange = "-1h"; // 1 小时
  } else {
    timeRange = "-1h"; // 默认 1 小时
  }

  console.log("Querying data for time range:", timeRange); // 打印实际的时间范围

  try {
    const queryApi = client.getQueryApi(org);
    const query = `
      from(bucket: "${bucket}")
        |> range(start: ${timeRange}) 
        |> filter(fn: (r) => r._measurement == "energy_consumption")
    `;
    console.log("Running query:", query); // 调试日志

    const rows = [];
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const data = tableMeta.toObject(row);
        rows.push(data);
      },
      error(error) {
        console.error(error);
        res.status(500).send("Error querying data");
      },
      complete() {
        res.json(rows);
      },
    });
  } catch (error) {
    res.status(500).send("Error querying data");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
