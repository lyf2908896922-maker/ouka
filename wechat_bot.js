/**
 * 欧卡2 TMP查询微信机器人
 * 
 * 说明：
 * 这是一个基于Node.js的微信机器人脚本，用于在微信群中查询TMP账号信息。
 * 使用方法：在微信群中发送 "#查询TMP 用户名" 或 "@机器人 查询TMP 用户名"
 * 
 * 注意：
 * 1. 使用前需要安装Node.js环境
 * 2. 需要安装相关依赖包
 * 3. 需要配置微信机器人框架（如WeChatBot、itchat等）
 * 4. 实际使用中需要替换为真实的微信机器人实现
 */

// 模拟微信机器人框架
class WeChatBot {
    constructor() {
        this.messageHandlers = [];
        console.log('🤖 欧卡2 TMP查询机器人已启动');
        console.log('📝 使用方法：发送 "#查询TMP 用户名" 或 "@机器人 查询TMP 用户名"');
        console.log('🔍 支持查询：账号信息、封禁记录、VTC信息');
        console.log('📋 查看历史：发送 "#历史查询"');
        console.log('❓ 帮助信息：发送 "#TMP帮助"');
        console.log('====================================');
    }

    // 注册消息处理器
    onMessage(handler) {
        this.messageHandlers.push(handler);
    }

    // 模拟接收消息
    receiveMessage(message) {
        console.log(`\n📥 收到消息: ${message.text}`);
        this.messageHandlers.forEach(handler => {
            handler(message);
        });
    }

    // 模拟发送消息
    sendMessage(chatId, text) {
        console.log(`📤 发送消息: ${text}`);
    }
}

// TMP查询工具类
class TMPQueryTool {
    constructor() {
        this.queryHistory = [];
        // 模拟数据 - 实际使用中应调用真实API
        this.mockData = {
            'yy10871': {
                id: 123456,
                name: 'yy10871',
                displayName: 'yy10871',
                joinDate: '2023-01-15T00:00:00Z',
                steamId: '76561198000000000',
                steamName: 'yy10871',
                onlineState: 'Online',
                onlineTime: '1234小时',
                vtc: {
                    id: 123,
                    name: '示例车队',
                    tag: 'EX'
                },
                bans: []
            },
            'trucker001': {
                id: 123457,
                name: 'trucker001',
                displayName: 'Trucker001',
                joinDate: '2022-06-20T00:00:00Z',
                steamId: '76561198000000001',
                steamName: 'Trucker001',
                onlineState: 'Offline',
                onlineTime: '5678小时',
                vtc: null,
                bans: [
                    {
                        active: false,
                        reason: '超速行驶',
                        expireTime: '2023-12-31T00:00:00Z'
                    }
                ]
            }
        };
    }

    // 查询TMP账号信息
    async queryUser(username) {
        console.log(`🔍 查询用户: ${username}`);
        
        // 检查模拟数据
        if (this.mockData[username.toLowerCase()]) {
            const userData = this.mockData[username.toLowerCase()];
            
            // 保存查询历史
            this.queryHistory.push({
                username: username,
                timestamp: new Date().toLocaleString('zh-CN'),
                success: true
            });
            
            return {
                success: true,
                data: userData
            };
        }
        
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟查询失败
        this.queryHistory.push({
            username: username,
            timestamp: new Date().toLocaleString('zh-CN'),
            success: false
        });
        
        return {
            success: false,
            message: '未找到该用户，请检查用户名是否正确'
        };
    }

    // 格式化查询结果
    formatResult(result) {
        if (!result.success) {
            return `❌ 查询失败：${result.message}`;
        }

        const user = result.data;
        let response = `🚛 **TMP账号查询结果** 🚛\n\n`;
        response += `👤 **用户名**: ${user.displayName}\n`;
        response += `🆔 **TMP ID**: ${user.id}\n`;
        response += `🕒 **加入时间**: ${new Date(user.joinDate).toLocaleDateString('zh-CN')}\n`;
        response += `🎮 **Steam名称**: ${user.steamName}\n`;
        response += `📊 **游戏时长**: ${user.onlineTime}\n`;
        response += `🟢 **在线状态**: ${user.onlineState === 'Online' ? '🟢 在线' : '🔴 离线'}\n`;
        
        if (user.vtc) {
            response += `🚚 **所属VTC**: ${user.vtc.name} [${user.vtc.tag}]\n`;
        } else {
            response += `🚚 **所属VTC**: 无\n`;
        }
        
        if (user.bans && user.bans.length > 0) {
            const activeBan = user.bans.find(ban => ban.active);
            if (activeBan) {
                response += `⚠️ **封禁状态**: 🚫 已封禁\n`;
                response += `📝 **封禁原因**: ${activeBan.reason}\n`;
                response += `⏰ **解封时间**: ${new Date(activeBan.expireTime).toLocaleString('zh-CN')}\n`;
            } else {
                response += `⚠️ **封禁状态**: ✅ 正常 (历史封禁: ${user.bans.length}次)\n`;
            }
        } else {
            response += `⚠️ **封禁状态**: ✅ 正常 (无封禁记录)\n`;
        }
        
        response += `\n🔗 **查询链接**: https://truckersmp.com/user/${user.id}\n`;
        response += `\n💡 提示：发送 "#查询TMP 用户名" 继续查询其他用户`;
        
        return response;
    }

    // 获取查询历史
    getHistory() {
        if (this.queryHistory.length === 0) {
            return '📝 暂无查询历史';
        }
        
        let response = `📋 **查询历史记录** (最近${Math.min(10, this.queryHistory.length)}条)\n\n`;
        
        this.queryHistory.slice(-10).forEach((record, index) => {
            const status = record.success ? '✅' : '❌';
            response += `${index + 1}. ${status} ${record.username} (${record.timestamp})\n`;
        });
        
        return response;
    }
}

// 主程序
function main() {
    const bot = new WeChatBot();
    const tmpQuery = new TMPQueryTool();

    // 注册消息处理器
    bot.onMessage(async (message) => {
        const text = message.text.trim();
        
        // 帮助命令
        if (text === '#TMP帮助' || text.includes('TMP帮助')) {
            const helpMessage = `🤖 **欧卡2 TMP查询机器人使用说明**\n\n` +
                `📝 **查询命令**:\n` +
                `- #查询TMP 用户名\n` +
                `- @机器人 查询TMP 用户名\n` +
                `- /查询TMP 用户名\n\n` +
                `📋 **其他命令**:\n` +
                `- #历史查询 - 查看查询历史\n` +
                `- #TMP帮助 - 显示此帮助信息\n\n` +
                `🔍 **支持查询**:\n` +
                `- 账号基本信息\n` +
                `- 封禁记录查询\n` +
                `- VTC团队信息\n\n` +
                `💡 **示例**:\n` +
                `#查询TMP yy10871`;
            
            bot.sendMessage(message.chatId, helpMessage);
            return;
        }
        
        // 历史查询命令
        if (text === '#历史查询' || text.includes('历史查询')) {
            const historyMessage = tmpQuery.getHistory();
            bot.sendMessage(message.chatId, historyMessage);
            return;
        }
        
        // 查询TMP命令
        const queryPatterns = [
            /^#查询TMP\s+(.+)$/,
            /^查询TMP\s+(.+)$/,
            /^\/查询TMP\s+(.+)$/,
            /.*查询TMP\s+(.+)$/
        ];
        
        for (const pattern of queryPatterns) {
            const match = text.match(pattern);
            if (match) {
                const username = match[1].trim();
                
                if (!username) {
                    bot.sendMessage(message.chatId, '❌ 请输入要查询的TMP用户名');
                    return;
                }
                
                // 发送查询中提示
                bot.sendMessage(message.chatId, `🔍 正在查询TMP用户 "${username}"，请稍候...`);
                
                try {
                    // 查询用户信息
                    const result = await tmpQuery.queryUser(username);
                    const formattedResult = tmpQuery.formatResult(result);
                    
                    // 发送查询结果
                    bot.sendMessage(message.chatId, formattedResult);
                } catch (error) {
                    console.error('查询错误:', error);
                    bot.sendMessage(message.chatId, '❌ 查询过程中发生错误，请稍后重试');
                }
                
                return;
            }
        }
        
        // 未匹配到命令，不做处理
    });

    // 模拟测试消息
    console.log('\n=== 测试消息示例 ===');
    bot.receiveMessage({ chatId: 'test-group', text: '#TMP帮助' });
    setTimeout(() => {
        bot.receiveMessage({ chatId: 'test-group', text: '#查询TMP yy10871' });
    }, 2000);
    setTimeout(() => {
        bot.receiveMessage({ chatId: 'test-group', text: '#查询TMP nonexistentuser' });
    }, 5000);
    setTimeout(() => {
        bot.receiveMessage({ chatId: 'test-group', text: '#历史查询' });
    }, 8000);
}

// 启动程序
if (require.main === module) {
    main();
}

// 导出类供其他模块使用
module.exports = {
    WeChatBot,
    TMPQueryTool
};