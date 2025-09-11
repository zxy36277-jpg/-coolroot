// 本地测试AI解析器
const fs = require('fs');

// 模拟DeepSeek API调用
async function testAIParsing() {
  const testContent = fs.readFileSync('test_fine_nutri.txt', 'utf-8');
  
  console.log('🧪 测试内容:');
  console.log(testContent);
  console.log('\n' + '='.repeat(50) + '\n');
  
  // 模拟AI解析结果
  const mockAIResult = {
    brandName: "斐萃FineNutri",
    sellingPoints: ["促进钙吸收", "增强骨骼健康", "保护心血管健康"],
    industry: "保健品",
    targetAudience: "中老年人、孕妇、儿童、爱美女性、健身人群",
    purpose: "品牌宣传",
    platforms: ["抖音", "快手", "小红书", "B站"],
    discount: "买二送一，限时优惠",
    forbiddenWords: ["最好", "第一", "绝对", "治愈", "治疗"],
    confidence: 0.95
  };
  
  console.log('✅ 期望的AI解析结果:');
  console.log(JSON.stringify(mockAIResult, null, 2));
  
  // 测试关键词匹配
  console.log('\n🔍 关键词匹配测试:');
  const keywords = {
    '保健品': [
      '维生素', '蛋白粉', '钙片', '鱼油', '益生菌', '胶原蛋白', '保健品', '营养品', 
      '膳食补充剂', '营养补充剂', '软胶囊', '胶囊', '营养', '健康', '免疫力', 
      '骨骼健康', '心血管健康', '肠道菌群', '美容养颜', '延缓衰老', '促进钙吸收', 
      '增强体质', '补充营养', '维生素d3', '维生素c', '维生素e', '维生素b', 
      '叶酸', '铁', '锌', '镁', '钙', 'omega-3', 'dha', 'epa', '辅酶q10', 
      '葡萄籽', '蜂胶', '燕窝', '灵芝', '人参', '枸杞', '阿胶', '冬虫夏草'
    ],
    '3C数码': [
      '手机', '电脑', '耳机', '相机', '智能设备', '数码', '电子', '科技', '芯片', 
      '处理器', '内存', '存储', '屏幕', '电池', '充电', '蓝牙', 'wifi', '5g', 
      '平板', '智能手表', '智能手环', '智能音箱', '智能家居', '路由器', '移动电源'
    ]
  };
  
  const lowerText = testContent.toLowerCase();
  
  for (const [industry, words] of Object.entries(keywords)) {
    const matches = words.filter(word => lowerText.includes(word.toLowerCase()));
    console.log(`${industry}: 匹配到 ${matches.length} 个关键词 - ${matches.join(', ')}`);
  }
  
  // 测试品牌名称识别
  console.log('\n🏷️ 品牌名称识别测试:');
  const brandPatterns = [
    /(?:品牌名称|品牌)[：:]\s*([^\n\r]+)/i,
    /([A-Za-z\u4e00-\u9fa5]+)\s*品牌手册/i,
    /([A-Za-z\u4e00-\u9fa5]+)\s*品\s*牌\s*手\s*册/i,
    /([A-Za-z\u4e00-\u9fa5]+)\s*应运而生/i
  ];
  
  for (const pattern of brandPatterns) {
    const match = testContent.match(pattern);
    if (match) {
      console.log(`✅ 匹配到品牌名称: ${match[1].trim()}`);
      break;
    }
  }
}

testAIParsing().catch(console.error);
