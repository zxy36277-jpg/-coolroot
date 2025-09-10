import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { config } from '../config/config';
import path from 'path';
import fs from 'fs';

// 确保数据目录存在
const dataDir = path.dirname(config.databasePath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(config.databasePath);

// 将回调风格的数据库操作转换为Promise
export const dbRun = promisify(db.run.bind(db)) as (sql: string, params?: any[]) => Promise<any>;
export const dbGet = promisify(db.get.bind(db)) as (sql: string, params?: any[]) => Promise<any>;
export const dbAll = promisify(db.all.bind(db)) as (sql: string, params?: any[]) => Promise<any[]>;

// 初始化数据库表
export const initDatabase = async () => {
  try {
    // 用户会话表
    await dbRun(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 产品信息表
    await dbRun(`
      CREATE TABLE IF NOT EXISTS product_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        brand_name TEXT NOT NULL,
        selling_points TEXT,
        promotion_info TEXT,
        industry TEXT NOT NULL,
        target_audience TEXT,
        video_purpose TEXT NOT NULL,
        platforms TEXT,
        forbidden_words TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      )
    `);

    // 脚本内容表
    await dbRun(`
      CREATE TABLE IF NOT EXISTS scripts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        template_type TEXT,
        title TEXT,
        cover_suggestion TEXT,
        hook TEXT,
        content TEXT,
        shooting_guide TEXT,
        performance_metrics TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      )
    `);

    console.log('数据库初始化完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
};

export default db;
