const input = document.getElementById("q");
const out = document.getElementById("out");
const btn = document.getElementById("btn");

const phoneInput = document.getElementById("phone");
const outPhone = document.getElementById("outPhone");
const btnPhone = document.getElementById("btnPhone");

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") cari();
});
btn.addEventListener("click", cari);

async function cari() {
  const q = input.value.trim();
  if (!q) {
    out.textContent = "Masukkan nama kelurahan atau kode pos dulu.";
    return;
  }

  btn.disabled = true;
  out.textContent = "Mencari...";

  try {
    const url = "https://kodepos.vercel.app/search/?q=" + encodeURIComponent(q);
    const res = await fetch(url);
    const json = await res.json();

    if (json.data && json.data.length > 0) {
      const formatted = {
        success: true,
        total: json.data.length,
        data: json.data.map((item) => ({
          Provinsi: item.province,
          Kota: item.regency,
          Kecamatan: item.district,
          Kelurahan: item.village,
          "Kode Pos": String(item.code),
          Latitude: item.latitude,
          Longitude: item.longitude
        }))
      };
      out.textContent = JSON.stringify(formatted, null, 2);
      saveRiwayat('POS', q);
    } else {
      out.textContent = JSON.stringify({
        success: false,
        message: "Data tidak ditemukan",
        total: 0,
        data: []
      }, null, 2);
      saveRiwayat('POS', q + ' (tidak ditemukan)');
    }
  } catch (err) {
    out.textContent = JSON.stringify({
      success: false,
      message: "Gagal mengambil data. Coba lagi nanti.",
      error: err.message
    }, null, 2);
  } finally {
    btn.disabled = false;
  }
}

phoneInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") cekNomor();
});
btnPhone.addEventListener("click", cekNomor);

function cekNomor() {
  let nomor = phoneInput.value.trim().replace(/[\s\-\+]/g, "");

  if (nomor.startsWith("62")) {
    nomor = "0" + nomor.slice(2);
  }

  if (!nomor) {
    outPhone.textContent = "Masukkan nomor HP dulu.";
    return;
  }

  const isValidFormat = /^08[1-9][0-9]{7,10}$/.test(nomor);

  if (!isValidFormat) {
    outPhone.textContent = JSON.stringify({
      success: false,
      nomor: nomor,
      valid: false,
      message: "Format nomor tidak valid. Contoh: 081234567890"
    }, null, 2);
    return;
  }

  const operator = deteksiOperator(nomor);
  const prefix = nomor.slice(0, 4);

  outPhone.textContent = JSON.stringify({
    success: true,
    nomor: nomor,
    valid: true,
    operator: operator.name,
    jenis: operator.jenis,
    prefix: prefix,
    message: "Nomor valid • Operator: " + operator.name
  }, null, 2);
  
  saveRiwayat('HP', nomor + ' - ' + operator.name);
}

function deteksiOperator(nomor) {
  for (const op of OPERATOR_DB) {
    if (op.prefixes.some((p) => nomor.startsWith(p))) {
      return { name: op.name, jenis: op.jenis };
    }
  }
  return { name: "Tidak dikenali", jenis: "-" };
}

const KEY = 'riwayat_kodepos';
const elList = document.getElementById('listRiwayat');
const elCount = document.getElementById('countRiwayat');
const elBtnAll = document.getElementById('btnHapusAll');

function getRW(){ return JSON.parse(localStorage.getItem(KEY) || '[]'); }

function saveRiwayat(tipe, keyword){
  if(!keyword) return;
  const data = getRW();
  data.unshift({ tipe, keyword, waktu: new Date().toLocaleString('id-ID') });
  localStorage.setItem(KEY, JSON.stringify(data.slice(0, 30)));
  renderRiwayat();
}

function renderRiwayat(){
  if(!elList) return;
  const data = getRW();
  if(elCount) elCount.textContent = '('+data.length+')';
  elList.innerHTML = data.length ? data.map((it,i)=>`
    <div style="display:flex;justify-content:space-between;align-items:center;background:#f3f3f3;padding:8px 12px;border-radius:8px;margin-bottom:6px">
      <div><b>[${it.tipe}] ${it.keyword}</b><br><small style="color:#777">${it.waktu}</small></div>
      <button onclick="hapusSatu(${i})" style="background:#ff3b3b;color:#fff;border:none;padding:6px 10px;border-radius:6px;cursor:pointer">Hapus</button>
    </div>
  `).join('') : '<p style="color:#888">Belum ada riwayat</p>';
}

window.hapusSatu = (i)=>{
  const data = getRW(); data.splice(i,1);
  localStorage.setItem(KEY, JSON.stringify(data));
  renderRiwayat();
}

if(elBtnAll){
  elBtnAll.onclick = ()=>{
    if(confirm('Hapus semua riwayat?')){
      localStorage.removeItem(KEY);
      renderRiwayat();
    }
  }
}

renderRiwayat();