const BACKEND_URL = "https://ruby-backend-lime.vercel.app";

let telegramId = "123456"; // افتراضي للتجربة خارج تليجرام
let firstName = "Player";

if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe?.user) {
    const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
    telegramId = tgUser.id;
    firstName = tgUser.first_name;
    console.log(`Welcome ${firstName} (${telegramId})`);
}


// تهيئة وتكبير الشاشة في تليجرام
if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand(); // فتح اللعبة ملء الشاشة
}


// عناصر الشاشات
const scoreDisplay = document.getElementById('score');
const profitDisplay = document.getElementById('profit-display');
const mainClicker = document.getElementById('main-clicker');

const mineScreen = document.getElementById('mine-screen');
const upgradesScreen = document.getElementById('upgrades-screen');
const marketScreen = document.getElementById('market-screen');
const tasksScreen = document.getElementById('tasks-screen');
const friendsScreen = document.getElementById('friends-screen');

const btnMine = document.getElementById('btn-mine');
const btnUpgrades = document.getElementById('btn-upgrades');
const btnMarket = document.getElementById('btn-market');
const btnTasks = document.getElementById('btn-tasks');
const btnFriends = document.getElementById('btn-friends');

// الترقيات والأسعار
// بيانات اللعبة والترقيات
let gameData = {
    balance: 62,          // الرصيد الحالي
    profitPerHour: 150,   // الربح بالساعة
    clickPower: 1,        // قوة النقرة
    
    pickaxe: {
        level: 1,
        cost: 50,
        powerBonus: 1,
        costMultiplier: 1.5 // زيادة السعر مع كل ترقية
    },
    furnace: {
        level: 1,
        cost: 200,
        profitBonus: 50,
        costMultiplier: 1.6
    }
};

// دالة شراء الترقيات
function buyUpgrade(type) {
    let item = gameData[type];
    
    if (gameData.balance >= item.cost) {
        // خصم التكلفة من الرصيد
        gameData.balance -= item.cost;
        
        // تطبيق تأثير الترقية
        if (type === 'pickaxe') {
            gameData.clickPower += item.powerBonus;
            item.level++;
            item.cost = Math.floor(item.cost * item.costMultiplier);
            
            // تحديث الواجهة للمعول
            document.getElementById('pickaxe-level').innerText = item.level;
            document.getElementById('pickaxe-cost').innerText = item.cost;
        } 
        else if (type === 'furnace') {
            gameData.profitPerHour += item.profitBonus;
            item.level++;
            item.cost = Math.floor(item.cost * item.costMultiplier);
            
            // تحديث الواجهة للفرن
            document.getElementById('furnace-level').innerText = item.level;
            document.getElementById('furnace-cost').innerText = item.cost;
            // إذا كان لديك عنصر يعرض الربح/ساعة في الأعلى:
            // document.getElementById('profit-display').innerText = gameData.profitPerHour + '+';
        }
        
        // تحديث الرصيد العام في الشاشة
        updateBalanceDisplay();
        
        // إظهار رسالة نجاح سريعة
        showToast("✨ تمت الترقية بنجاح!");
    } else {
        showToast("❌ رصيدك غير كافٍ!", "error");
    }
}

// تحديث عرض الرصيد في الشاشة الرئيسية
// دالة واحدة متكاملة لتحديث جميع عناصر الرصيد والواجهة
function updateBalanceDisplay() {
    // 1. تحديث رقم الرصيد في الشاشة الرئيسية
    const balanceEl = document.getElementById('balance-display');
    if (balanceEl) {
        balanceEl.innerText = gameData.balance;
    }

    // 2. تحديث رقم الربح في الساعة (إن وجد)
    const profitEl = document.getElementById('profit-display');
    if (profitEl) {
        profitEl.innerText = `${gameData.profitPerHour}+`;
    }
}

// دالة شراء الترقية المحدثة
function buyUpgrade(type) {
    let item = gameData[type];
    
    // التاكد من وجود رصيد كافٍ
    if (gameData.balance >= item.cost) {
        // 1. خصم السعر من الرصيد
        gameData.balance -= item.cost;
        
        // 2. تطبيق تأثير الترقية وتكبير السعر للمرة القادمة
        if (type === 'pickaxe') {
            gameData.clickPower += item.powerBonus;
            item.level++;
            item.cost = Math.floor(item.cost * item.costMultiplier);
            
            document.getElementById('pickaxe-level').innerText = item.level;
            document.getElementById('pickaxe-cost').innerText = item.cost;
            document.getElementById('pickaxe-power-add').innerText = gameData.clickPower;
        } 
        else if (type === 'furnace') {
            gameData.profitPerHour += item.profitBonus;
            item.level++;
            item.cost = Math.floor(item.cost * item.costMultiplier);
            
            document.getElementById('furnace-level').innerText = item.level;
            document.getElementById('furnace-cost').innerText = item.cost;
        }
        
        // 3. تحديث الرصيد على الشاشة فوراً
        updateBalanceDisplay();
        
        showToast("✨ تمت الترقية بنجاح!");
    } else {
        showToast("❌ رصيدك غير كافٍ!", "error");
    }
}

// دالة إظهار التنبيهات المؤقتة (Toast)
function showToast(message, type = "success") {
    let toast = document.createElement('div');
    toast.innerText = message;
    toast.style.position = 'fixed';
    toast.style.top = '30px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)';
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '20px';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = 'bold';
    toast.style.zIndex = '99999';
    toast.style.backdropFilter = 'blur(5px)';
    toast.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

const clickUpgradeCostDisplay = document.getElementById('click-upgrade-cost');
const passiveUpgradeCostDisplay = document.getElementById('passive-upgrade-cost');

// متغيّرات اللعبة (القيم الافتراضية)
let score = 0;
let clickPower = parseInt(localStorage.getItem('ember_click_power')) || 1; 
let profitPerHour = parseInt(localStorage.getItem('ember_profit_hour')) || 150; 

let clickUpgradeCost = parseInt(localStorage.getItem('ember_c_cost')) || 50;
let passiveUpgradeCost = parseInt(localStorage.getItem('ember_p_cost')) || 200;

let isTgTaskDone = localStorage.getItem('task_tg_done') === 'true';
let isYtTaskDone = localStorage.getItem('task_yt_done') === 'true';

// 1. جلب بيانات اللاعب من السيرفر فور فتح اللعبة
async function loadPlayerData() {
    const initData = tg.initData || "";

    try {
        const response = await fetch(`${BACKEND_URL}/api/user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initData })
        });

        const data = await response.json();

        if (data.success && data.user) {
            // تحديث الرصيد من قاعدة البيانات
            score = data.user.balance || 0;
            console.log("✅ تم جلب البيانات من السيرفر بنجاح:", data.user);
        }
    } catch (error) {
        console.error("❌ فشل الاتصال بالسيرفر، جاري استخدام التخزين المحلي كبديل:", error);
        score = parseFloat(localStorage.getItem('ember_score')) || 0;
    } finally {
        updateUI();
    }
}

// 2. حفظ وحفظ التقدم والرصيد إلى السيرفر
async function syncWithServer() {
    const initData = tg.initData || "";
    localStorage.setItem('ember_score', score); // حفظ محلي احتياطي

    try {
        await fetch(`${BACKEND_URL}/api/user/sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                initData,
                balance: Math.floor(score)
            })
        });
    } catch (error) {
        console.error("❌ خطأ أثناء حفظ التقدم على السيرفر:", error);
    }
}

function updateUI() {
    scoreDisplay.textContent = Math.floor(score);
    profitDisplay.textContent = `+${profitPerHour}`;
    clickUpgradeCostDisplay.textContent = clickUpgradeCost;
    passiveUpgradeCostDisplay.textContent = passiveUpgradeCost;

    if (isTgTaskDone) {
        const tgTaskBtn = document.getElementById('task-tg');
        if (tgTaskBtn) {
            tgTaskBtn.textContent = "تم ✅";
            tgTaskBtn.classList.add('done');
        }
    }
    if (isYtTaskDone) {
        const ytTaskBtn = document.getElementById('task-yt');
        if (ytTaskBtn) {
            ytTaskBtn.textContent = "تم ✅";
            ytTaskBtn.classList.add('done');
        }
    }
}

// 3. نظام التعدين التلقائي
setInterval(() => {
    let profitPerSecond = profitPerHour / 3600;
    score += profitPerSecond;
    scoreDisplay.textContent = Math.floor(score);
}, 1000);

// مزامنة الرصيد مع السيرفر تلقائياً كل 10 ثوانٍ
setInterval(() => {
    syncWithServer();
}, 10000);

// 4. النقر اليدوي
// دالة إظهار الرقم المتطاير عند النقر
function showFloatingNumber(event, amount) {
    // 1. تحديد مكان النقلة على الشاشة (سواء بالماوس أو بالتاتش في الموبايل)
    let x, y;
    if (event.touches && event.touches.length > 0) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
    } else if (event.clientX && event.clientY) {
        x = event.clientX;
        y = event.clientY;
    } else {
        // مكان افتراضي في منتصف السندان إذا لم تتوفر إحداثيات
        const anvil = document.querySelector('.clicker-frame');
        const rect = anvil.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
    }

    // 2. إنشاء عنصر الرقم
    const floatEl = document.createElement('div');
    floatEl.className = 'floating-number';
    floatEl.innerText = `+${amount}`;
    
    // وضع الرقم في مكان النقلة بالضبط على الشاشة
    floatEl.style.left = `${x}px`;
    floatEl.style.top = `${y}px`;

    // إضافته للـ body مباشرة حتى لا يختفي خلف أي عنصر أو يقصه overflow
    document.body.appendChild(floatEl);

    // حذفه بعد انتهاء الحركة
    setTimeout(() => {
        floatEl.remove();
    }, 800);
}

// ================= طريقة الاستدعاء عند الضغط على السندان =================
const anvilElement = document.querySelector('.clicker-frame');

if (anvilElement) {
    // دعم النقر والتاتش المباشر على الموبايل
    anvilElement.addEventListener('pointerdown', function(e) {
        // زيادة الرصيد بقوة النقرة الحالية
        gameData.balance += gameData.clickPower;
        updateBalanceDisplay();
        
        // إظهار الرقم المتطاير
        showFloatingNumber(e, gameData.clickPower);
    });
}


// 5. نظام التنقل والتبديل بين الـ 4 شاشات
function showScreen(activeBtn, screenToShow) {
    [mineScreen, upgradesScreen, marketScreen, tasksScreen, friendsScreen].forEach(s => s?.classList.add('hidden'));
    [btnMine, btnUpgrades, btnMarket, btnTasks, btnFriends].forEach(b => b?.classList.remove('active'));
    
    screenToShow?.classList.remove('hidden');
    activeBtn?.classList.add('active');
}

btnMine.addEventListener('click', () => showScreen(btnMine, mineScreen));
btnUpgrades.addEventListener('click', () => showScreen(btnUpgrades, upgradesScreen));
btnMarket.addEventListener('click', () => showScreen(btnMarket, marketScreen));
btnTasks.addEventListener('click', () => showScreen(btnTasks, tasksScreen));
btnFriends.addEventListener('click', () => showScreen(btnFriends, friendsScreen));

// 6. شراء الترقيات
document.getElementById('buy-click-upgrade').addEventListener('click', () => {
    if (score >= clickUpgradeCost) {
        score -= clickUpgradeCost;
        clickPower += 1;
        clickUpgradeCost = Math.floor(clickUpgradeCost * 1.5);
        localStorage.setItem('ember_click_power', clickPower);
        localStorage.setItem('ember_c_cost', clickUpgradeCost);
        updateUI();
        syncWithServer(); // حفظ سحابي فور الشراء
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    }
});

document.getElementById('buy-passive-upgrade').addEventListener('click', () => {
    if (score >= passiveUpgradeCost) {
        score -= passiveUpgradeCost;
        profitPerHour += 50;
        passiveUpgradeCost = Math.floor(passiveUpgradeCost * 1.6);
        localStorage.setItem('ember_profit_hour', profitPerHour);
        localStorage.setItem('ember_p_cost', passiveUpgradeCost);
        updateUI();
        syncWithServer(); // حفظ سحابي فور الشراء
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    }
});

// 7. نظام المهام
document.getElementById('task-tg').addEventListener('click', () => {
    if (!isTgTaskDone) {
        if (tg.openTelegramLink) tg.openTelegramLink('https://t.me/telegram'); 
        score += 1000;
        isTgTaskDone = true;
        localStorage.setItem('task_tg_done', 'true');
        updateUI();
        syncWithServer(); // حفظ سحابي فور إتمام المهمة
    }
});

document.getElementById('task-yt').addEventListener('click', () => {
    if (!isYtTaskDone) {
        if (tg.openLink) tg.openLink('https://youtube.com');
        score += 500;
        isYtTaskDone = true;
        localStorage.setItem('task_yt_done', 'true');
        updateUI();
        syncWithServer(); // حفظ سحابي فور إتمام المهمة
    }
});

// 8. نظام دعوة الأصدقاء والمشاركة الفورية
document.getElementById('btn-invite-friend').addEventListener('click', () => {
    const userId = tg.initDataUnsafe?.user?.id || "test_user";
    const botLink = `https://t.me/YOUR_BOT_USERNAME/app?startapp=ref_${userId}`;
    const inviteText = encodeURIComponent("🔥 العب معي في لعبة Ember الممتعة! ابنِ فرن التعدين الخاص بك واكسب عملات ذهبية مجانية فوراً! 💰");
    
    if (tg.openTelegramLink) {
        tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(botLink)}&text=${inviteText}`);
    }
});

// 9. تشغيل جلب البيانات تلقائياً عند فتح اللعبة
loadPlayerData();

//10. إضافة الموارد والمخزن إلى بيانات اللعبة الرئيسية
gameData.inventory = gameData.inventory || { ruby: 0, coal: 0 };

let marketState = {
    ruby: { price: 50, history: [48, 49, 50, 51, 50], change: 0 },
    coal: { price: 12, history: [10, 11, 12, 11, 12], change: 0 }
};

// 1. دالة تحديث الأسعار بشكل حي (شغالة كل 4 ثوانٍ)
function startMarketFluctuations() {
    setInterval(() => {
        updateResourcePrice('ruby', 35, 70); // يتردد سعر الياقوت بين 35 و 70
        updateResourcePrice('coal', 8, 20);   // يتردد سعر الفحم بين 8 و 20
        drawMarketChart();                   // رسم المنحنى مجدداً
    }, 4000);
}

function updateResourcePrice(type, min, max) {
    let item = marketState[type];
    let changePercent = (Math.random() * 0.12 - 0.06); // تغيير عشوائي بين -6% و +6%
    let newPrice = Math.round(item.price * (1 + changePercent));

    // ضمان أن السعر لا يخرج عن الحد الأدنى والأقصى
    newPrice = Math.max(min, Math.min(max, newPrice));

    item.change = (((newPrice - item.price) / item.price) * 100).toFixed(1);
    item.price = newPrice;
    
    // حفظ تاريخ الأسعار للرسم البياني (نحتفظ بـ 10 نقاط فقط)
    item.history.push(newPrice);
    if (item.history.length > 10) item.history.shift();

    // تحديث الأرقام على الشاشة
    const priceEl = document.getElementById(`${type}-price`);
    if (priceEl) priceEl.innerText = item.price;

    if (type === 'ruby') {
        const changeEl = document.getElementById('ruby-price-change');
        if (changeEl) {
            changeEl.innerText = `${item.change >= 0 ? '+' : ''}${item.change}%`;
            changeEl.className = `price-change ${item.change >= 0 ? 'up' : 'down'}`;
        }
    }
}

// 2. دالة البيع والشراء
function tradeResource(type, action) {
    let item = marketState[type];
    
    if (action === 'buy') {
        if (gameData.balance >= item.price) {
            gameData.balance -= item.price;
            gameData.inventory[type]++;
            showToast(`✅ تم شراء 1 ${type === 'ruby' ? 'ياقوت' : 'فحم'}`);
        } else {
            showToast("❌ رصيدك غير كافٍ للشراء!", "error");
        }
    } else if (action === 'sell') {
        if (gameData.inventory[type] > 0) {
            gameData.inventory[type]--;
            gameData.balance += item.price;
            showToast(`💰 تم بيع 1 ${type === 'ruby' ? 'ياقوت' : 'فحم'} بـ ${item.price}`);
        } else {
            showToast("❌ لا تملك هذا المورد لبيعه!", "error");
        }
    }

    // تحديث الرصيد وقيم المخزن في الواجهة
    updateBalanceDisplay();
    const ownedEl = document.getElementById(`${type}-owned`);
    if (ownedEl) ownedEl.innerText = gameData.inventory[type];
}

// 3. رسم الرسم البياني المباشر (HTML5 Canvas Chart)
function drawMarketChart() {
    const canvas = document.getElementById('marketChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const data = marketState.ruby.history;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const margin = 20;
    const width = canvas.width - margin * 2;
    const height = canvas.height - margin * 2;
    
    const minVal = Math.min(...data) - 2;
    const maxVal = Math.max(...data) + 2;

    // رسم الخط
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = marketState.ruby.change >= 0 ? '#10b981' : '#ef4444';

    data.forEach((val, index) => {
        const x = margin + (index / (data.length - 1)) * width;
        const y = canvas.height - margin - ((val - minVal) / (maxVal - minVal)) * height;
        
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();
}

// تشغيل البورصة فور تحميل اللعبة
document.addEventListener('DOMContentLoaded', () => {
    startMarketFluctuations();
});
