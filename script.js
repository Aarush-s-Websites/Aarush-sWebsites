/* ============================================================
   aarush.dev — script
   Content (phone number, work project, pricing, about bio) is
   loaded from content.json, which is editable via the Pages CMS
   admin panel — no code changes needed to update any of it.
   ============================================================ */

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- mobile nav ---------- */
const toggle = document.getElementById("navToggle");
const nav = document.getElementById("mainNav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}));

/* ---------- escape helper (content.json is trusted, but this is
   cheap insurance if it's ever hand-edited with a stray < or &) ---------- */
function esc(str){
  return String(str ?? "").replace(/[&<>"']/g, ch => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
  ));
}

/* ---------- render pricing cards ---------- */
function renderPricing(tiers){
  const grid = document.getElementById("pricingGrid");
  grid.innerHTML = tiers.map(tier => `
    <div class="price-card${tier.highlight ? " highlight" : ""}">
      <h3 class="price-name">${esc(tier.name)}</h3>
      <p class="price-amount">${esc(tier.amount)}${tier.note ? ` <span>${esc(tier.note)}</span>` : ""}</p>
      <ul class="price-list">
        ${tier.features.map(f => `<li>${esc(f)}</li>`).join("")}
      </ul>
      <a href="#contact" class="btn ${tier.highlight ? "btn-primary" : "btn-outline"}">Get a quote</a>
    </div>`).join("");
}

/* ---------- render the about bio (paragraphs separated by blank lines) ---------- */
function renderAbout(text){
  const wrap = document.getElementById("aboutParagraphs");
  wrap.innerHTML = String(text || "")
    .split(/\n\s*\n/)
    .map(para => `<p>${esc(para.trim())}</p>`)
    .join("");
}

/* ---------- render the work card + contact info ---------- */
function renderWork(work){
  document.getElementById("workCard").href = work.url;
  document.getElementById("workDomain").textContent = work.domain;
  document.getElementById("workTag").textContent = work.tag;
  document.getElementById("workTitle").textContent = work.title;
  document.getElementById("workDescription").textContent = work.description;
}

function renderContact(data){
  const digits = String(data.phone || "").replace(/[^\d+]/g, "");
  const phoneLink = document.getElementById("phoneLink");
  phoneLink.href = "tel:" + digits;
  phoneLink.textContent = data.phone;
  document.getElementById("contactNote").textContent = data.contactNote;
}

/* ---------- load everything ---------- */
async function loadContent(){
  try{
    const res = await fetch("content.json", { cache: "no-store" });
    const data = await res.json();
    renderWork(data.work);
    renderContact(data);
    renderAbout(data.about);
    renderPricing(data.pricing);
  }catch(e){
    console.error("Could not load content.json:", e);
  }
}
loadContent();
