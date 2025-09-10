# 通义千问API密钥获取指南（免费额度）

## 🎯 推荐方案：通义千问（阿里云）

### 优势
- ✅ **免费额度**：新用户每月有免费调用次数
- ✅ **中文优化**：对中文内容生成效果很好
- ✅ **稳定可靠**：阿里云服务，稳定性高
- ✅ **申请简单**：只需要手机号注册

### 获取步骤

#### 1. 注册阿里云账户
1. 访问：https://www.aliyun.com/
2. 点击"免费注册"
3. 使用手机号注册账户
4. 完成实名认证

#### 2. 开通通义千问服务
1. 访问：https://dashscope.aliyun.com/
2. 点击"立即开通"
3. 选择"通义千问"服务
4. 同意服务协议

#### 3. 获取API密钥
1. 登录后访问：https://dashscope.aliyun.com/apiKey
2. 点击"创建新的API Key"
3. 输入密钥名称（如：脚本文案助手）
4. 复制生成的API密钥（以`sk-`开头）

#### 4. 查看免费额度
1. 访问：https://dashscope.aliyun.com/console
2. 查看"用量统计"
3. 新用户通常有免费额度

### 配置到GitHub

#### 在GitHub仓库中添加环境变量：
1. 访问：https://github.com/zxy36277-jpg/-coolroot/settings/secrets/actions
2. 点击"New repository secret"
3. 名称：`DASHSCOPE_API_KEY`
4. 值：您刚才复制的API密钥
5. 点击"Add secret"

### 费用说明
- **免费额度**：新用户通常有免费调用次数
- **付费标准**：超出免费额度后按调用次数收费
- **预估成本**：生成一个脚本约0.01-0.05元

## 🔄 其他免费方案

### 方案2：文心一言（百度）
- 注册地址：https://yiyan.baidu.com/
- 环境变量名：`BAIDU_API_KEY`

### 方案3：智谱AI
- 注册地址：https://open.bigmodel.cn/
- 环境变量名：`ZHIPU_API_KEY`

### 方案4：月之暗面（Kimi）
- 注册地址：https://platform.moonshot.cn/
- 环境变量名：`MOONSHOT_API_KEY`

## 🚀 快速测试

获取API密钥后，您可以：

1. **本地测试**：
   ```bash
   # 设置环境变量
   export DASHSCOPE_API_KEY=your-key-here
   
   # 启动服务
   npm start
   ```

2. **在线测试**：
   - 配置GitHub环境变量后
   - 推送代码触发自动部署
   - 访问部署后的网站测试

## 📞 需要帮助？

如果遇到问题：
1. 查看阿里云官方文档：https://help.aliyun.com/
2. 联系阿里云客服
3. 或者选择其他AI服务提供商
