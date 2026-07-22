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
function showTab(screenId, btnId) {
    // 1. إخفاء جميع الشاشات
    const allScreens = ['mine-screen', 'upgrades-section', 'market-section', 'tasks-screen', 'friends-screen'];
    allScreens.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    // 2. إلغاء التحديد (active) من جميع أزرار القائمة السفلية
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

    // 3. إظهار الشاشة المطلوبة وتفعيل الزر الخاص بها
    const targetScreen = document.getElementById(screenId);
    const targetBtn = document.getElementById(btnId);

    if (targetScreen) targetScreen.classList.remove('hidden');
    if (targetBtn) targetBtn.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    
    document.getElementById('btn-mine')?.addEventListener('click', () => showTab('mine-screen', 'btn-mine'));
    document.getElementById('btn-upgrades')?.addEventListener('click', () => showTab('upgrades-section', 'btn-upgrades'));
    document.getElementById('btn-market')?.addEventListener('click', () => showTab('market-section', 'btn-market'));
    document.getElementById('btn-tasks')?.addEventListener('click', () => showTab('tasks-screen', 'btn-tasks'));
    document.getElementById('btn-friends')?.addEventListener('click', () => showTab('friends-screen', 'btn-friends'));

});

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
        if (tg.openTelegramLink) tg.openTelegramLink('https://t.me/coffee_me_you'); 
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

//8. ================= نظام دعوة الأصدقاء والمهام =================

// دالة نسخ رابط الإحالة (Referral Link)
window.inviteFriend = function() {
    // محاكاة رابط إحالة خاص باللاعب
    const userId = Math.floor(Math.random() * 1000000); 
    const inviteLink = `https://t.me/RubyForgeBot?start=${userId}`;
    
    // نسخ الرابط للحافظة
    navigator.clipboard.writeText(inviteLink).then(() => {
        alert("🔗 تم نسخ رابط الدعوة بنجاح! شاركه مع أصدقائك لتربح 5000 عملة.");
    }).catch(err => {
        alert("حدث خطأ أثناء نسخ الرابط.");
    });
};

// دالة تنفيذ مهمة (مثل الانضمام لقناة تليجرام)
window.completeTask = function(reward, buttonElement) {
    // فتح الرابط (مثال: قناة تليجرام)
    window.open("https://t.me/coffee_me_you", "_blank");
    
    // إضافة المكافأة بعد 3 ثواني (محاكاة التأكد من المهمة)
    setTimeout(() => {
        gameData.balance += reward;
        let balanceEl = document.getElementById('balance');
        if (balanceEl) balanceEl.innerText = Math.floor(gameData.balance);
        
        // تغيير شكل الزر لـ "مكتمل"
        buttonElement.innerText = "✅ اكتملت";
        buttonElement.disabled = true;
        buttonElement.style.background = "#4b5563";
        
        alert(`🎉 مبروك! حصلت على ${reward} عملة.`);
    }, 500);
};


// 9. تشغيل جلب البيانات تلقائياً عند فتح اللعبة
loadPlayerData();

//10. إضافة الموارد والمخزن إلى بيانات اللعبة الرئيسية
gameData.inventory = gameData.inventory || { ruby: 0, coal: 0 };
// ================= نظام السوق المحدث والآمن =================
gameData.inventory = gameData.inventory || { ruby: 0, coal: 0 };

let marketState = {
    ruby: { price: 50, history: [48, 49, 50, 51, 50], change: 0 },
    coal: { price: 12, history: [10, 11, 12, 11, 12], change: 0 }
};

// تشغيل السوق (تأكد إنها بتشتغل بعد تحميل الصفحة)
document.addEventListener('DOMContentLoaded', () => {
    // رسم الشارت المبدئي
    setTimeout(drawMarketChart, 500); 
    
    // تحديث الأسعار كل 4 ثواني
    setInterval(() => {
        updateResourcePrice('ruby', 35, 70);
        updateResourcePrice('coal', 8, 20);
        drawMarketChart();
    }, 4000);
});

function updateResourcePrice(type, min, max) {
    let item = marketState[type];
    let changePercent = (Math.random() * 0.12 - 0.06); 
    let newPrice = Math.round(item.price * (1 + changePercent));

    newPrice = Math.max(min, Math.min(max, newPrice));
    item.change = (((newPrice - item.price) / item.price) * 100).toFixed(1);
    item.price = newPrice;
    
    item.history.push(newPrice);
    if (item.history.length > 10) item.history.shift();

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

// دالة البيع والشراء (تم إضافة تنبيهات بسيطة لو دالة showToast مش موجودة)
window.tradeResource = function(type, action) {
    let item = marketState[type];
    
    if (action === 'buy') {
        if (gameData.balance >= item.price) {
            gameData.balance -= item.price;
            gameData.inventory[type]++;
            alert(`✅ تم شراء ${type} بنجاح!`); // نستخدم alert كبديل مؤقت لو Toast فيها مشكلة
        } else {
            alert("❌ رصيدك غير كافٍ للشراء!");
        }
    } else if (action === 'sell') {
        if (gameData.inventory[type] > 0) {
            gameData.inventory[type]--;
            gameData.balance += item.price;
            alert(`💰 تم بيع ${type} بـ ${item.price}`);
        } else {
            alert("❌ لا تملك هذا المورد لبيعه!");
        }
    }

    // تحديث الرصيد في الشاشة
    let balanceEl = document.getElementById('balance');
    if (balanceEl) balanceEl.innerText = Math.floor(gameData.balance);

    const ownedEl = document.getElementById(`${type}-owned`);
    if (ownedEl) ownedEl.innerText = gameData.inventory[type];
};

function drawMarketChart() {
    const canvas = document.getElementById('marketChart');
    // منع الخطأ إذا كانت الشاشة مخفية
    if (!canvas || canvas.offsetParent === null) return; 
    
    const ctx = canvas.getContext('2d');
    const data = marketState.ruby.history;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const margin = 10;
    const width = canvas.width - margin * 2;
    const height = canvas.height - margin * 2;
    
    const minVal = Math.min(...data) - 2;
    const maxVal = Math.max(...data) + 2;

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
