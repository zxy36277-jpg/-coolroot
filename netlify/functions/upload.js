const multer = require('multer');

// 内存存储配置
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件格式，请上传txt、pdf、docx或doc文件'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

exports.handler = async (event, context) => {
  // 处理CORS预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // 解析multipart/form-data
    const boundary = event.headers['content-type']?.split('boundary=')[1];
    if (!boundary) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ success: false, error: '请选择要上传的文件' })
      };
    }

    // 模拟AI解析结果
    const mockResult = {
      brandName: 'FineNutri斐萃',
      sellingPoints: ['6000倍抗氧化力的麦角硫因核心成分', '内外双抗抗垂抗纹', '三甲医院真实人体实验验证效果'],
      promotionInfo: '无明确优惠信息',
      industry: '保健品',
      targetAudience: '25-40岁都市女性、职场精英、精致妈妈',
      videoPurpose: '产品推广',
      platforms: ['抖音', '小红书', '淘宝'],
      forbiddenWords: '治愈, 治疗'
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        data: {
          content: 'FineNutri斐萃抗衰胶囊，6000倍抗氧化力的麦角硫因核心成分，内外双抗抗垂抗纹，三甲医院真实人体实验验证效果，适合25-40岁都市女性、职场精英、精致妈妈使用。',
          extractedInfo: mockResult
        }
      })
    };

  } catch (error) {
    console.error('上传处理错误:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: false, 
        error: '服务器内部错误，请稍后重试' 
      })
    };
  }
};
