import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5119,
  nodeEnv: process.env.NODE_ENV || 'development',
  deepseekApiKey: process.env.DEEPSEEK_API_KEY || 'sk-295761577e304806a3c5c17b0064d11c',
  deepseekApiUrl: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions',
  databasePath: process.env.DATABASE_PATH || './data/script_assistant.db'
};
