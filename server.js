const express = require('express');
const cors = require('cors'); // ตรวจสอบว่ามีบรรทัดนี้
const app = express();
const port = 3001;

// ต้องอยู่ตรงนี้! ก่อนการกำหนด route
app.use(cors());

// route ของคุณ
app.get('/api/agents', (req, res) => {
    // ...
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// Enable JSON body parsing for all incoming requests
app.use(express.json());

// ข้อมูล agents
const agents = [
    {
        code: "A001",
        name: "John Doe",
        status: "active",
        email: "john.doe@example.com",
        phone: "0812345678",
        role: "Support",
        shift: "Day",
        lastLogin: "2025-09-03T10:30:00Z"
    },
    {
        code: "A002",
        name: "Jane Smith",
        status: "inactive",
        email: "jane.smith@example.com",
        phone: "0898765432",
        role: "Sales",
        shift: "Night",
        lastLogin: "2025-09-02T21:15:00Z"
    },
    {
        code: "A003",
        name: "Bob Lee",
        status: "active",
        email: "bob.lee@example.com",
        phone: "0823456789",
        role: "Support",
        shift: "Day",
        lastLogin: "2025-09-03T09:50:00Z"
    }
];

// GET All Agents
app.get('/api/agents', (req, res) => {
    res.json({
        success: true,
        data: agents,
        count: agents.length,
        timestamp: new Date().toISOString()
    });
});

// GET Count of Agents
app.get('/api/agents/count', (req, res) => {
    res.json({
        success: true,
        count: agents.length,
        timestamp: new Date().toISOString()
    });
});

 //PATCH Agent Status
app.put('/api/agents/:code/status', (req, res) => {
    // Step 1: ดึง agent code จาก URL
    const agentCode = req.params.code;

    // Step 2: ดึง status ใหม่จาก body
    const newStatus = req.body.status;

    // Step 3: หา agent ในระบบ
    const agent = agents.find(a => a.code === agentCode);

    // Step 4: ตรวจสอบว่าหา agent เจอหรือไม่
    if (!agent) {
        return res.status(404).json({
            success: false,
            message: `Agent with code ${agentCode} not found`
        });
    }

    // Step 5: ตรวจสอบ valid statuses
    const validStatuses = ["Available", "Active", "Wrap Up", "Not Ready", "Offline", "active", "inactive"];
    
    if (!validStatuses.includes(newStatus)) {
        return res.status(400).json({
            success: false,
            message: `Invalid status: ${newStatus}`
        });
    }

    // Step 6: บันทึกสถานะเก่าและอัปเดตสถานะใหม่
    const oldStatus = agent.status;
    agent.status = newStatus;

    // Step 7: ส่ง response กลับ
    res.json({
        success: true,
        agentCode: agent.code,
        oldStatus: oldStatus,
        newStatus: agent.status,
        timestamp: new Date().toISOString()
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/api/dashboard/stats', (req, res) => {
    // ขั้นที่ 1: นับจำนวนรวม
    const totalAgents = agents.length; 
    
    // ขั้นที่ 2: นับจำนวน Agents ในแต่ละสถานะ
    const available = agents.filter(a => a.status === "Available").length;
    const active = agents.filter(a => a.status === "Active").length;
    const wrapUp = agents.filter(a => a.status === "WrapUp").length;
    const notReady = agents.filter(a => a.status === "Not Ready").length;
    const offline = agents.filter(a => a.status === "Offline").length;
    
    // ขั้นที่ 3: คำนวณเปอร์เซ็นต์  
    const availablePercent = totalAgents > 0 ? 
        Math.round((available / totalAgents) * 100) : 0;
    const activePercent = totalAgents > 0 ? 
        Math.round((active / totalAgents) * 100) : 0;
    const wrapUpPercent = totalAgents > 0 ?
        Math.round((wrapUp / totalAgents) * 100) : 0;
    const notReadyPercent = totalAgents > 0 ?
        Math.round((notReady / totalAgents) * 100) : 0;
    const offlinePercent = totalAgents > 0 ?
        Math.round((offline / totalAgents) * 100) : 0;

    // ขั้นที่ 4: สร้าง Response
    const responseData = {
        success: true,
        data: {
            total: totalAgents,
            statusBreakdown: {
                available: { "count": available, "percent": availablePercent },
                active: { "count": active, "percent": activePercent },
                wrapUp: { "count": wrapUp, "percent": wrapUpPercent },
                notReady: { "count": notReady, "percent": notReadyPercent },
                offline: { "count": offline, "percent": offlinePercent }
            },
            timestamp: new Date().toISOString()
        }
    };
    
    // ส่ง Response กลับไป
    res.json(responseData);
    
const cors = require('cors');
app.use(cors());

});