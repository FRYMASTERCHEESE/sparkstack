const $ = (id) => document.getElementById(id);
const store = {
  get() {
    try {
      return JSON.parse(localStorage.getItem("sparkstack") || "{}");
    } catch {
      return {};
    }
  },
  set(patch) {
    const next = { ...store.get(), ...patch };
    localStorage.setItem("sparkstack", JSON.stringify(next));
    return next;
  },
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function renderPoints() {
  const s = store.get();
  $("pointsPill").textContent = `${s.points || 0} pts`;
}

function addPoints(n, why) {
  const s = store.get();
  store.set({ points: (s.points || 0) + n });
  renderPoints();
  toast(`+${n} pts · ${why}`);
}

function toast(msg) {
  const el = document.createElement("div");
  el.textContent = msg;
  el.style.cssText =
    "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#6ee7b7;color:#062016;padding:10px 14px;border-radius:999px;font-weight:700;z-index:9;font-size:14px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1800);
}

/* tabs */
document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((b) => b.classList.remove("on"));
    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("on"));
    btn.classList.add("on");
    document.getElementById(btn.dataset.tab).classList.add("on");
  });
});

/* check-in */
function paintCheckin() {
  const s = store.get();
  $("streakLabel").textContent = `Streak: ${s.streak || 0} days`;
  if (s.lastCheckin === todayKey()) {
    $("checkinBtn").disabled = true;
    $("checkinBtn").textContent = "Already checked in today";
  }
}
$("checkinBtn").addEventListener("click", () => {
  const s = store.get();
  if (s.lastCheckin === todayKey()) return;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = yesterday.toISOString().slice(0, 10);
  const streak = s.lastCheckin === yKey ? (s.streak || 0) + 1 : 1;
  const bonus = Math.min(20, (streak - 1) * 2);
  store.set({ lastCheckin: todayKey(), streak });
  addPoints(10 + bonus, `check-in${bonus ? " + streak" : ""}`);
  paintCheckin();
});

$("adBtn").addEventListener("click", () => {
  $("adBtn").disabled = true;
  $("adBtn").textContent = "Playing demo…";
  setTimeout(() => {
    addPoints(5, "demo ad");
    $("adBtn").disabled = false;
    $("adBtn").textContent = "Watch demo ad (+5 pts)";
  }, 1200);
});

$("offerBtn").addEventListener("click", () => {
  addPoints(25, "offer-wall demo (not a real survey)");
});

/* wallet */
function paintAddr() {
  const s = store.get();
  if (s.address) {
    $("addr").value = s.address;
    $("addrStatus").textContent = "Watching (view only): " + s.address.slice(0, 8) + "…" + s.address.slice(-6);
  } else {
    $("addrStatus").textContent = "No address saved.";
  }
  if (s.note) $("note").value = s.note;
}
$("saveAddr").addEventListener("click", () => {
  const v = $("addr").value.trim();
  if (v.length < 20) {
    toast("That does not look like a full address");
    return;
  }
  store.set({ address: v });
  paintAddr();
  toast("Address saved on this device");
});
$("clearAddr").addEventListener("click", () => {
  store.set({ address: "" });
  $("addr").value = "";
  paintAddr();
});
$("saveNote").addEventListener("click", () => {
  store.set({ note: $("note").value });
  toast("Note saved on this device");
});

async function loadPrices() {
  const box = $("prices");
  box.innerHTML = "<li>Loading…</li>";
  try {
    const url =
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true";
    const res = await fetch(url);
    if (!res.ok) throw new Error("network");
    const data = await res.json();
    const rows = [
      ["Bitcoin", data.bitcoin],
      ["Ethereum", data.ethereum],
      ["Solana", data.solana],
    ];
    box.innerHTML = rows
      .map(([name, d]) => {
        const ch = d.usd_24h_change || 0;
        const sign = ch >= 0 ? "+" : "";
        return `<li><span>${name}</span><span>$${d.usd.toLocaleString()} <small>(${sign}${ch.toFixed(1)}%)</small></span></li>`;
      })
      .join("");
  } catch {
    box.innerHTML = "<li>Could not load prices. Try again on Wi-Fi.</li>";
  }
}
$("refreshPrices").addEventListener("click", loadPrices);

/* lessons */
const LESSONS = [
  {
    id: "l1",
    title: "Public address vs seed phrase",
    q: "What is safe to paste into SparkStack?",
    choices: [
      "Your 12 or 24 word seed phrase",
      "Your public receive address only",
      "Your bank PIN",
    ],
    answer: 1,
    why: "A public address is like a mailbox number. A seed phrase is the key to the box. Never type the key here.",
  },
  {
    id: "l2",
    title: "Who pays for “free” points?",
    q: "When this app is live with ads, who pays?",
    choices: [
      "Nobody. Coins appear from thin air",
      "Advertisers pay the app owner a cut",
      "Google prints Bitcoin for every user",
    ],
    answer: 1,
    why: "AdMob / AdGate pay the publisher. You then decide how many points that is worth. No ads = no real budget.",
  },
  {
    id: "l3",
    title: "Your wallet, not theirs",
    q: "If an app asks you to send crypto to the owner’s personal wallet to “invest for you”…",
    choices: [
      "That is normal and safe",
      "Do not do it — they can take the coins",
      "Only do it if they promise 100% profit",
    ],
    answer: 1,
    why: "If someone else holds the coins, they can spend them. SparkStack only watches an address you already own.",
  },
];

function renderLessons() {
  const s = store.get();
  const done = s.lessons || {};
  $("lessons").innerHTML = LESSONS.map((l) => {
    if (done[l.id]) {
      return `<article class="card"><h2>${l.title}</h2><p class="ok">Done. ${l.why}</p></article>`;
    }
    return `<article class="card lesson" data-id="${l.id}">
      <h2>${l.title}</h2>
      <q>${l.q}</q>
      <div class="choices">
        ${l.choices.map((c, i) => `<button data-i="${i}">${c}</button>`).join("")}
      </div>
      <p class="meta hint"></p>
    </article>`;
  }).join("");

  $("lessons").querySelectorAll(".lesson").forEach((card) => {
    const lesson = LESSONS.find((x) => x.id === card.dataset.id);
    card.querySelectorAll(".choices button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.i);
        const hint = card.querySelector(".hint");
        if (i === lesson.answer) {
          const cur = store.get();
          store.set({ lessons: { ...(cur.lessons || {}), [lesson.id]: true } });
          addPoints(15, lesson.title);
          renderLessons();
        } else {
          hint.textContent = "Not that one. " + lesson.why;
          hint.classList.add("bad");
        }
      });
    });
  });
}

renderPoints();
paintCheckin();
paintAddr();
renderLessons();
loadPrices();
