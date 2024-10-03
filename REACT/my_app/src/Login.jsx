import React, { useState } from "react";
import "./LoginForm.css";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    login: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const url = "http://localhost:80/auth/rest/token";
    const headers = {
      'Content-Type': 'application/json'
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // 请求成功，可以在此处处理响应
        const data = await response.json();
        const accessToken = data.access_token;
      
        // 保存 access token，你可以使用 localStorage 或其他方法
        localStorage.setItem("accessToken", accessToken);
      
        // 跳转到指定页面
        window.open("https://www.polito.it/", "_blank");
      } else {
        // 请求失败，可以在此处处理错误
        console.error("请求失败");
        // 弹出警告框显示错误消息
        window.alert("Could not log in. Incorrect login or password.");
      }
    } catch (error) {
      // 捕获异常，可以在此处处理异常
      console.error("请求出错", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div id="login-form">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="login">Username:</label>
        <input
          type="text"
          id="login"
          name="login"
          value={formData.login}
          onChange={handleInputChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );

};

export default LoginForm;