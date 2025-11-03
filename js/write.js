// 获取Canvas元素和上下文
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const undoBtn = document.getElementById('undoBtn');
const clearBtn = document.getElementById('clearBtn');

// 初始化变量
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let drawingHistory = [];
const MAX_HISTORY = 50;
let points = []; // 存储采样点

// 设置Canvas尺寸
function resizeCanvas() {
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    initializeCanvas();
}

// 初始化画布
function initializeCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveCanvasState();
    updateUndoButton();
    // 设置Canvas样式
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
}

// 保存当前画布状态到历史记录
function saveCanvasState() {
    if (drawingHistory.length >= MAX_HISTORY) {
        drawingHistory.shift();
    }
    drawingHistory.push(canvas.toDataURL());
    updateUndoButton();
}

// 更新撤回按钮状态
function updateUndoButton() {
    undoBtn.disabled = drawingHistory.length <= 1;
}

// 开始绘制
function startDrawing(e) {
    isDrawing = true;
    const [x, y] = getCoordinates(e);
    points = [{x, y}]; // 重置点数组
    lastX = x;
    lastY = y;
    
    // 开始新路径
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// 绘制中
function draw(e) {
    if (!isDrawing) return;

    const [x, y] = getCoordinates(e);
    
    // 添加当前点到数组
    points.push({x, y});
    
    // 限制点数以提高性能
    if (points.length > 5) {
        points.shift();
    }
    
    // 使用贝塞尔曲线实现平滑效果
    if (points.length >= 3) {
        const prevPoint = points[points.length - 2];
        const currentPoint = points[points.length - 1];
        
        // 计算控制点（前一个点和当前点的中点）
        const cpX = (prevPoint.x + currentPoint.x) / 2;
        const cpY = (prevPoint.y + currentPoint.y) / 2;
        
        // 绘制二次贝塞尔曲线
        ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, cpX, cpY);
        ctx.stroke();
        
        // 开始新路径从当前点继续
        ctx.beginPath();
        ctx.moveTo(cpX, cpY);
    } else {
        // 点数不足时使用直线
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // 开始新路径从当前点继续
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    
    lastX = x;
    lastY = y;
}

// 停止绘制
function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        points = []; // 清空点数组
        saveCanvasState();
    }
}

// 获取坐标（处理鼠标和触摸事件）
function getCoordinates(e) {
    let x, y;

    if (e.type.includes('touch')) {
        const rect = canvas.getBoundingClientRect();
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    } else {
        const rect = canvas.getBoundingClientRect();
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    }

    return [x, y];
}

// 清除画布
function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawingHistory = [];
    points = [];
    saveCanvasState();
}

// 撤回上一步
function undoLastStep() {
    if (drawingHistory.length > 1) {
        drawingHistory.pop();

        const previousState = drawingHistory[drawingHistory.length - 1];
        const img = new Image();
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = previousState;

        updateUndoButton();
    }
}

// 事件监听器
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// 触摸事件支持
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

// 按钮事件
clearBtn.addEventListener('click', clearCanvas);
undoBtn.addEventListener('click', undoLastStep);


// 初始化Canvas尺寸和画布
resizeCanvas();