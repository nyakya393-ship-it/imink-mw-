const KEY = "inklog_battles";

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {

    initRegister();
    renderHistory();
    renderAnalysis();
});

/* =========================
   REGISTER
========================= */

function initRegister(){

    const form = document.getElementById("battleForm");
    if(!form) return;

    // 初期日時
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    const dateInput = document.getElementById("battleDate");
    if(dateInput){
        dateInput.value = now.toISOString().slice(0,16);
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const battle = {
            id: Date.now(),

            date: val("battleDate"),
            battleType: val("battleType"),
            rule: val("rule"),
            stage: val("stage"),
            weapon: val("weapon"),
            rank: val("rank"),
            result: val("result"),

            kill: num("kill"),
            assist: num("assist"),
            death: num("death"),
            special: num("special"),
            paint: num("paint"),

            memo: val("memo")
        };

        const data = getData();
        data.push(battle);
        saveData(data);

        form.reset();
        alert("保存完了");
    });
}

/* =========================
   HISTORY
========================= */

function renderHistory(){

    const el = document.getElementById("list");
    if(!el) return;

    const data = getData();

    if(data.length === 0){
        el.innerHTML = "<p>まだデータがありません</p>";
        return;
    }

    el.innerHTML = data.map(b => `
        <div class="card">
            <div><b>${b.date}</b></div>
            <div>${b.result} / ${b.stage}</div>
            <div>${b.weapon}</div>

            <button class="btn-detail" onclick="detail(${b.id})">詳細</button>
            <button class="btn-delete" onclick="removeBattle(${b.id})">削除</button>
        </div>
    `).join("");
}

/* =========================
   ANALYSIS
========================= */

function renderAnalysis(){

    const el = document.getElementById("analysis");
    if(!el) return;

    const data = getData();

    const total = data.length;
    const win = data.filter(b => b.result === "win").length;

    const winRate = total ? ((win / total) * 100).toFixed(1) : 0;

    const avgKill = avg(data, "kill");
    const avgDeath = avg(data, "death");
    const kd = avgDeath ? (avgKill / avgDeath).toFixed(2) : avgKill;

    el.innerHTML = `
        <div class="card">
            <h3>戦績分析</h3>
            <p>試合数：${total}</p>
            <p>勝率：${winRate}%</p>
            <p>平均キル：${avgKill}</p>
            <p>平均デス：${avgDeath}</p>
            <p>K/D目安：${kd}</p>
        </div>
    `;
}

/* =========================
   ACTIONS
========================= */

function removeBattle(id){
    const data = getData().filter(b => b.id !== id);
    saveData(data);
    renderHistory();
    renderAnalysis();
}

function detail(id){
    const b = getData().find(x => x.id === id);
    alert(
`日時: ${b.date}
結果: ${b.result}
ステージ: ${b.stage}
ブキ: ${b.weapon}
キル: ${b.kill}
デス: ${b.death}
アシスト: ${b.assist}
スペシャル: ${b.special}
塗り: ${b.paint}
メモ: ${b.memo}`
    );
}

/* =========================
   STORAGE
========================= */

function getData(){
    return JSON.parse(localStorage.getItem(KEY)) || [];
}

function saveData(data){
    localStorage.setItem(KEY, JSON.stringify(data));
}

/* =========================
   HELPERS
========================= */

function val(id){
    const el = document.getElementById(id);
    return el ? el.value : "";
}

function num(id){
    const el = document.getElementById(id);
    return el ? Number(el.value) : 0;
}

function avg(arr, key){
    if(arr.length === 0) return 0;
    return (arr.reduce((a,b) => a + (b[key] || 0), 0) / arr.length).toFixed(1);
}
<div class="card">
  <div><b>${b.date}</b></div>
  <div>${b.result} / ${b.stage}</div>
  <div>${b.weapon}</div>

  <button class="btn-detail">詳細</button>
  <button class="btn-delete">削除</button>
</div>
