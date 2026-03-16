/**
 * UBTS Schedule - Dark Theme (Original Style)
 * Adaptive: Mobile Timeline | Desktop Table
 */

// ========================================
// DATA
// ========================================
const scheduleData = [
    { start: "8:15", end: "9:00", type: "meal", label: "Сніданок", task: "Сніданок у їдальні", short: "Снід." },
    { start: "9:00", end: "9:50", lesson: 1, type: "lecture", mon: "-", tue: "Лекції", wed: "Лекції", thu: "Лекції", fri: "Лекції", task: "Аудиторна робота" },
    { start: "9:50", end: "10:00", type: "break", label: "Перерва", task: "Коротка перерва (10 хв)" },
    { start: "10:00", end: "10:50", lesson: 2, type: "mixed", mon: "Часл", tue: "Лекції", wed: "Лекції", thu: "Лекції", fri: "Лекції", task: "Увага: Часи в Пн!" },
    { start: "10:50", end: "11:10", type: "break", label: "Перерва", task: "Перерва між парами (20 хв)" },
    { start: "11:10", end: "12:00", lesson: 3, type: "lecture", mon: "Лекції", tue: "Лекції", wed: "Лекції", thu: "Лекції", fri: "Лекції", task: "Аудиторна робота" },
    { start: "12:00", end: "12:10", type: "break", label: "Перерва", task: "Підготовка (10 хв)" },
    { start: "12:10", end: "13:00", lesson: 4, type: "lecture", mon: "Лекції", tue: "Лекції", wed: "Лекції", thu: "Лекції", fri: "Лекції", task: "Аудиторна робота" },
    { start: "13:00", end: "14:10", type: "meal", label: "Обід", task: "Обідня перерва (70 хв)", short: "Обід" },
    { start: "14:10", end: "15:00", lesson: 5, type: "lecture", mon: "Лекції", tue: "Лекції", wed: "Лекції", thu: "Лекції", fri: "Лекції", task: "Аудиторна робота" },
    { start: "15:00", end: "15:10", type: "break", label: "Перерва", task: "Коротка перерва (10 хв)" },
    { start: "15:10", end: "16:00", lesson: 6, type: "lecture", mon: "Лекції", tue: "Лекції", wed: "Лекції", thu: "Лекції", fri: "Лекції", task: "Аудиторна робота" },
    { start: "16:00", end: "16:10", type: "break", label: "Перерва", task: "Перерва (10 хв)" },
    { start: "16:10", end: "17:00", lesson: 7, type: "lecture", mon: "Лекції", tue: "Лекції", wed: "Лекції", thu: "Лекції", fri: "Лекції", task: "Аудиторна робота" },
    { start: "17:00", end: "17:10", type: "break", label: "Перерва", task: "Остання перерва (10 хв)" },
    { start: "17:10", end: "18:00", lesson: 8, type: "lecture", mon: "Лекції", tue: "Лекції", wed: "Лекції", thu: "Лекції", fri: "Лекції", task: "Аудиторна робота" },
    { start: "18:00", end: "18:45", type: "meal", label: "Вечеря", task: "Вечеря", short: "Веч." }
];

const days = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];
const shortDays = ['', 'mon', 'tue', 'wed', 'thu', 'fri'];

let selectedDay = new Date().getDay();
if (selectedDay === 0 || selectedDay === 6) selectedDay = 1;

// ========================================
// UTILITIES
// ========================================
function parseTime(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

function getActivityForDay(item, day) {
    if (item.type === 'meal' || item.type === 'break') return item.label;
    const key = shortDays[day];
    return item[key] || '-';
}

function getTypeClass(activity, itemType) {
    if (itemType === 'meal') return 'type-meal';
    if (itemType === 'break') return 'type-break';
    if (activity === 'Часл') return 'type-chapel';
    if (activity === '-') return 'type-empty';
    return 'type-lecture';
}

function getTypeLabel(itemType) {
    return { lecture: 'Лекція', meal: 'Їжа', break: 'Перерва', mixed: 'Заняття' }[itemType] || 'Заняття';
}

// ========================================
// CLOCK & DATE
// ========================================
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('date').textContent = `${days[now.getDay()]}, ${now.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })}`;
}

// ========================================
// MOBILE: TIMELINE
// ========================================
function renderTimeline(day) {
    const timeline = document.getElementById('timeline');
    const now = new Date();
    const currentDay = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    timeline.innerHTML = '';
    
    if (day === 0 || day === 6) {
        timeline.innerHTML = `
            <div class="weekend-message">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"></path>
                </svg>
                <div class="weekend-title">Вихідний!</div>
                <div>Насолоджуйся відпочинком</div>
            </div>`;
        return;
    }

    let foundCurrent = false, foundNext = false;

    scheduleData.forEach((item) => {
        const startMin = parseTime(item.start);
        const endMin = parseTime(item.end);
        const isToday = day === currentDay;
        const isPast = isToday && currentMinutes > endMin;
        const isCurrent = isToday && currentMinutes >= startMin && currentMinutes < endMin;
        const isNext = isToday && !isCurrent && !foundCurrent && !foundNext && currentMinutes < startMin;
        
        if (isCurrent) foundCurrent = true;
        if (isNext) foundNext = true;

        const activity = getActivityForDay(item, day);
        if (activity === '-') return;

        const div = document.createElement('div');
        div.className = 'timeline-item';
        if (isCurrent) div.classList.add('current');
        if (isNext) div.classList.add('next');
        if (isPast) div.classList.add('past');

        div.innerHTML = `
            <div class="time-column">
                <div class="time-start">${item.start}</div>
                <div class="time-end">${item.end}</div>
            </div>
            <div class="content-card">
                ${isCurrent ? '<div class="now-indicator"></div>' : ''}
                <div class="card-header">
                    ${item.lesson ? `<span class="lesson-number">№${item.lesson}</span>` : ''}
                    <span class="card-type ${getTypeClass(activity, item.type)}">${getTypeLabel(item.type)}</span>
                </div>
                <div class="card-title">${activity}</div>
                <div class="card-task">${item.task}</div>
            </div>`;
        
        timeline.appendChild(div);
    });
}

// ========================================
// DESKTOP: DARK TABLE
// ========================================
function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    scheduleData.forEach((item) => {
        const tr = document.createElement('tr');
        tr.dataset.time = item.start.split(':')[0];
        
        // Time
        const timeTd = document.createElement('td');
        timeTd.className = 'time-cell';
        timeTd.textContent = `${item.start}-${item.end}`;
        tr.appendChild(timeTd);

        // Lesson number
        const numTd = document.createElement('td');
        numTd.className = 'lesson-cell';
        numTd.textContent = item.lesson || '';
        tr.appendChild(numTd);

        // Day columns
        for (let d = 1; d <= 5; d++) {
            const td = document.createElement('td');
            const activity = getActivityForDay(item, d);
            td.dataset.day = d;
            td.textContent = activity;

            if (item.type === 'break') td.className = 'break-cell';
            else if (item.type === 'meal') td.className = 'meal-cell';
            else if (activity === 'Часл') td.className = 'chapel-cell';
            else if (activity === '-') td.className = 'empty-cell';
            else td.className = 'lecture-cell';

            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    });
}

function highlightTable() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Clear
    document.querySelectorAll('td[data-day]').forEach(cell => {
        cell.classList.remove('current-day', 'current-cell');
    });
    document.querySelectorAll('tr').forEach(row => {
        row.classList.remove('current-time-row');
    });

    // Highlight current day column
    if (currentDay >= 1 && currentDay <= 5) {
        document.querySelectorAll(`td[data-day="${currentDay}"]`).forEach(cell => {
            cell.classList.add('current-day');
        });
    }

    // Highlight current time
    for (let item of scheduleData) {
        const startMin = parseTime(item.start);
        const endMin = parseTime(item.end);
        
        if (currentMinutes >= startMin && currentMinutes < endMin) {
            const row = document.querySelector(`tr[data-time="${item.start.split(':')[0]}"]`);
            if (row) {
                row.classList.add('current-time-row');
                if (currentDay >= 1 && currentDay <= 5) {
                    const cell = row.querySelector(`td[data-day="${currentDay}"]`);
                    if (cell) cell.classList.add('current-cell');
                }
            }
            break;
        }
    }
}

// ========================================
// STATUS CARD
// ========================================
function updateStatusCard() {
    const card = document.getElementById('statusCard');
    const activityEl = document.getElementById('currentActivity');
    const taskEl = document.getElementById('currentTask');
    const nextUp = document.getElementById('nextUp');
    const nextActivity = document.getElementById('nextActivity');

    const now = new Date();
    const currentDay = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (selectedDay !== currentDay || currentDay === 0 || currentDay === 6) {
        activityEl.textContent = days[selectedDay];
        taskEl.textContent = selectedDay >= 1 && selectedDay <= 5 ? 'Обраний день для перегляду' : 'Вихідний день';
        nextUp.style.display = 'none';
        card.style.background = selectedDay >= 1 && selectedDay <= 5
            ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)'
            : 'linear-gradient(135deg, #065f46 0%, #047857 100%)';
        return;
    }

    let currentItem = null, nextItem = null;

    for (let item of scheduleData) {
        const start = parseTime(item.start);
        const end = parseTime(item.end);
        
        if (currentMinutes >= start && currentMinutes < end) currentItem = item;
        else if (!currentItem && !nextItem && currentMinutes < start) nextItem = item;
        else if (currentItem && !nextItem && currentMinutes < start) { nextItem = item; break; }
    }

    card.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

    if (currentItem) {
        const act = getActivityForDay(currentItem, currentDay);
        activityEl.textContent = act === '-' ? 'Вільний час' : act;
        taskEl.textContent = currentItem.task;
        
        if (nextItem) {
            const nextAct = getActivityForDay(nextItem, currentDay);
            if (nextAct !== '-') {
                nextUp.style.display = 'block';
                nextActivity.textContent = `${nextAct} о ${nextItem.start}`;
            } else nextUp.style.display = 'none';
        } else nextUp.style.display = 'none';
    } else {
        activityEl.textContent = 'Вільний час';
        taskEl.textContent = 'Навчання закінчилося на сьогодні';
        nextUp.style.display = 'none';
    }
}

// ========================================
// DAY SELECTOR
// ========================================
function initDaySelector() {
    const container = document.getElementById('daySelector');
    const buttons = container.querySelectorAll('.day-btn');
    const today = new Date().getDay();

    buttons.forEach(btn => {
        const day = parseInt(btn.dataset.day);
        btn.classList.remove('active', 'today');
        if (day === today) btn.classList.add('today');
        if (day === selectedDay) btn.classList.add('active');
        
        btn.onclick = () => {
            selectedDay = day;
            initDaySelector();
            renderTimeline(selectedDay);
            updateStatusCard();
            highlightTable();
        };
    });

    const active = container.querySelector('.active');
    if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

// ========================================
// SWIPE & KEYBOARD
// ========================================
let touchStartX = 0;

document.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });

document.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
        if (diff > 0 && selectedDay < 5) selectedDay++;
        else if (diff < 0 && selectedDay > 1) selectedDay--;
        else return;
        initDaySelector();
        renderTimeline(selectedDay);
        updateStatusCard();
    }
}, { passive: true });

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && selectedDay > 1) selectedDay--;
    else if (e.key === 'ArrowRight' && selectedDay < 5) selectedDay++;
    else return;
    initDaySelector();
    renderTimeline(selectedDay);
    updateStatusCard();
});

// ========================================
// INIT
// ========================================
function init() {
    updateClock();
    setInterval(updateClock, 1000);
    
    initDaySelector();
    renderTimeline(selectedDay);
    renderTable();
    highlightTable();
    updateStatusCard();
    
    setInterval(() => {
        renderTimeline(selectedDay);
        highlightTable();
        updateStatusCard();
    }, 60000);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
