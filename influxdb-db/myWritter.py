import random
import time
from datetime import datetime
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS
# InfluxDB 配置
token = "BYsgwMWPgvK57UJX3IAfJBXIsa45ELbBAd4eKKLAYpHYtn06JW8trCthh_oR6gTZv9ve-P-bBHBDeFXbD8K7ig=="   # 替换为你的 InfluxDB token
org = "Polito"                # 替换为你的组织
bucket = "test"          # 替换为你的 bucket 名
url = "http://localhost:8086"   # 如果 InfluxDB 运行在本地

# 创建 InfluxDB 客户端
client = InfluxDBClient(url=url, token=token, org=org)
write_api = client.write_api(write_options=SYNCHRONOUS)

def generate_energy_data():
    # 模拟生成能量消耗数据
    energy_consumption = random.uniform(1.0, 5.0)  # 随机生成 1.0 到 5.0 kW 的能量消耗
    timestamp = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')  # 生成 UTC 时间戳
    
    point = Point("energy_consumption") \
        .tag("location", "building_1") \
        .field("value", energy_consumption) \
        .time(timestamp, WritePrecision.NS)
    
    return point

def write_to_influxdb():
    # 将模拟的数据写入 InfluxDB
    point = generate_energy_data()
    write_api.write(bucket=bucket, org=org, record=point)
    print(f"Written data: {point}")

if __name__ == "__main__":
    try:
        while True:
            write_to_influxdb()
            time.sleep(5)  # 每 5 秒写入一次数据
    except KeyboardInterrupt:
        print("Data generation stopped.")
    finally:
        client.close()