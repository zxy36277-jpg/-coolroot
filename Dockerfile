# 多阶段构建
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY client/package*.json ./
RUN npm ci --only=production

# 复制源代码
COPY client/ ./

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建的文件到nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
