export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return new Response(
            JSON.stringify({ error: '只支持 POST 请求' }),
            { status: 405, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const { message } = await req.json();
    if (!message) {
        return new Response(
            JSON.stringify({ error: '消息不能为空' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
        return new Response(
            JSON.stringify({ error: '服务器配置错误' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: '你是唐东杰布，藏戏创始人，用慈悲智慧的语气回答，限制在100字以内'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 200
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'API 调用失败');
        }

        const reply = data.choices[0].message.content;
        
        return new Response(
            JSON.stringify({ reply }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: '服务器内部错误' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
export default async function handler(req, res) {
    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '只支持 POST 请求' });
    }

    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: '消息不能为空' });
    }

    // 从环境变量读取 API Key
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: '服务器配置错误' });
    }

    try {
        // 调用 DeepSeek API
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: '你是唐东杰布，藏戏创始人，用慈悲智慧的语气回答，限制在100字以内'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 200
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'API 调用失败');
        }

        const reply = data.choices[0].message.content;
        res.status(200).json({ reply });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器内部错误' });
    }
}
