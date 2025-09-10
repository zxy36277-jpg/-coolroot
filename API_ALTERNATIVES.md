# AI API 替代方案

## 🥇 强烈推荐方案

### DeepSeek（性价比之王）
**优势**：
- ✅ **性价比最高**：价格比OpenAI便宜很多
- ✅ **中文优化**：对中文内容生成效果很好
- ✅ **性能强劲**：推理速度快，响应及时
- ✅ **稳定可靠**：服务稳定，API调用成功率高
- ✅ **申请简单**：注册流程简单，审核快速

**获取方式**：查看 `GET_DEEPSEEK_KEY.md`

## 1. 免费方案

### 方案A：使用本地AI模型
```bash
# 安装Ollama（本地AI运行环境）
curl -fsSL https://ollama.ai/install.sh | sh

# 下载中文模型
ollama pull qwen2.5:7b

# 启动本地AI服务
ollama serve
```

### 方案B：使用免费在线API
- **通义千问**：https://dashscope.aliyun.com/（有免费额度）
- **文心一言**：https://yiyan.baidu.com/
- **智谱AI**：https://open.bigmodel.cn/

## 2. 低成本方案

### 方案C：使用国内AI服务
- **月之暗面（Kimi）**：https://platform.moonshot.cn/
- **零一万物**：https://platform.lingyiwanwu.com/
- **百川智能**：https://platform.baichuan-ai.com/

## 3. 配置说明

### 环境变量配置
```bash
# DeepSeek（强烈推荐，性价比最高）
deepseek_api_key=sk-your-deepseek-key

# OpenAI（需要付费）
openai_api_key=sk-your-key-here

# 通义千问（免费额度）
dashscope_api_key=your-dashscope-key

# 文心一言（免费额度）
baidu_api_key=your-baidu-key

# 智谱AI（免费额度）
zhipu_api_key=your-zhipu-key
```

### 修改代码支持多API
需要修改 `src/services/aiService.ts` 文件，添加对不同API的支持。

## 4. 推荐方案

**强烈推荐**：
1. **DeepSeek**：性价比最高，中文优化好，申请简单
2. 查看 `GET_DEEPSEEK_KEY.md` 获取详细指南

**新手推荐**：
1. 先使用通义千问免费额度测试
2. 确认功能正常后，考虑购买DeepSeek API

**预算充足**：
直接使用OpenAI API，效果最佳但价格较高

**技术用户**：
使用Ollama本地部署，完全免费但需要一定技术基础
