const BACKEND_URL = "https://ruby-backend-lime.vercel.app";

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
const tasksScreen = document.getElementById('tasks-screen');
const friendsScreen = document.getElementById('friends-screen');

const btnMine = document.getElementById('btn-mine');
const btnUpgrades = document.getElementById('btn-upgrades');
const btnTasks = document.getElementById('btn-tasks');
const btnFriends = document.getElementById('btn-friends');

// الترقيات والأسعار
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
mainClicker.addEventListener('pointerdown', (event) => {
    score += clickPower;
    scoreDisplay.textContent = Math.floor(score);

    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');

    const floatElement = document.createElement('div');
    floatElement.classList.add('floating-number');
    floatElement.textContent = `+${clickPower}`;
    floatElement.style.left = `${event.clientX}px`;
    floatElement.style.top = `${event.clientY - 20}px`;
    document.querySelector('.clicker-area').appendChild(floatElement);
    setTimeout(() => floatElement.remove(), 1000);
});

// 5. نظام التنقل والتبديل بين الـ 4 شاشات
function showScreen(activeBtn, screenToShow) {
    [mineScreen, upgradesScreen, tasksScreen, friendsScreen].forEach(s => s?.classList.add('hidden'));
    [btnMine, btnUpgrades, btnTasks, btnFriends].forEach(b => b?.classList.remove('active'));
    
    screenToShow?.classList.remove('hidden');
    activeBtn?.classList.add('active');
}

btnMine.addEventListener('click', () => showScreen(btnMine, mineScreen));
btnUpgrades.addEventListener('click', () => showScreen(btnUpgrades, upgradesScreen));
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
