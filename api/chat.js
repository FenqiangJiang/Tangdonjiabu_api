export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method === 'POST') {
        return res.status(200).json({ 
            reply: '后端工作正常！' 
        });
    }
    
    return res.status(405).json({ error: '只支持POST' });
}
