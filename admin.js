/************  GANTI_DI_SINI  ************/
const TOKEN    = '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';              // <-- paste GitHub personal token
const GIST_ID  = '5c5af4a6251465d7d353aa21f499bebe';            // <-- paste ID gist Anda
const PASSWORD = 'rioaji777';                     // boleh diganti
/*****************************************/

function login(){
  if(document.getElementById('passInput').value === PASSWORD){
    document.getElementById('loginBox').classList.add('hidden');
    document.getElementById('adminBox').classList.remove('hidden');
    loadGist();
  }else{
    alert('Password salah!');
  }
}

async function loadGist(){
  if(!TOKEN || !GIST_ID || TOKEN==='GANTI_TOKEN_ANDA' || GIST_ID==='GANTI_GIST_ID_ANDA'){
    info('⚠️  Lengkapi TOKEN & GIST_ID di admin.js terlebih dahulu.');
    return;
  }
  try{
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`);
    if(!res.ok) throw new Error('Gist tidak ditemukan');
    const data = await res.json();
    const rawUrl = data.files['data.json'].raw_url;
    const produk = await fetch(rawUrl+'?t='+Date.now()).then(r=>r.json());
    if(produk.length){
      const p = produk[0];
      document.getElementById('nama').value  = p.nama;
      document.getElementById('harga').value = p.harga;
      document.getElementById('stok').value  = p.stok;
      document.getElementById('foto').value  = p.foto;
      document.getElementById('desk').value  = p.desk;
    }
    info('✅ Data lama berhasil dimuat.');
  }catch(e){
    info('⚠️  Gagal memuat gist, Anda bisa mulai dari awal.');
  }
}

function previewProduct(){
  const nama  = document.getElementById('nama').value.trim();
  const harga = document.getElementById('harga').value;
  const stok  = document.getElementById('stok').value;
  const foto  = document.getElementById('foto').value.trim();
  const desk  = document.getElementById('desk').value.trim();
  if(!nama || !harga || !stok || !foto || !desk){
    alert('Lengkapi semua field terlebih dahulu.');
    return;
  }
  const card = `
    <img src="${foto}" alt="${nama}">
    <h3>${nama}</h3>
    <p>${desk}</p>
    <strong>Rp ${Number(harga).toLocaleString('id')} / kotak</strong>
    <p>Stok: ${stok} pcs</p>
  `;
  document.getElementById('previewCard').innerHTML = card;
  document.getElementById('previewCard').classList.remove('hidden');
}

async function saveGist(){
  const nama  = document.getElementById('nama').value.trim();
  const harga = Number(document.getElementById('harga').value);
  const stok  = Number(document.getElementById('stok').value);
  const foto  = document.getElementById('foto').value.trim();
  const desk  = document.getElementById('desk').value.trim();
  if(!nama || !harga || !stok || !foto || !desk){
    alert('Lengkapi semua field terlebih dahulu.');
    return;
  }
  if(TOKEN==='GANTI_TOKEN_ANDA' || GIST_ID==='GANTI_GIST_ID_ANDA'){
    alert('Lengkapi TOKEN & GIST_ID di admin.js terlebih dahulu.');
    return;
  }

  const produk = [{nama, harga, stok, foto, desk}];

  const payload = {
    description: 'Data produk Wajik Buk Atik',
    files: {
      'data.json': {
        content: JSON.stringify(produk, null, 2)
      }
    }
  };

  try{
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`,{
      method:'PATCH',
      headers:{
        'Authorization': `token ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if(!res.ok) throw new Error(res.statusText);
    info('✅ Berhasil disimpan ke GitHub Gist!');
  }catch(e){
    info('❌ Gagal menyimpan: ' + e.message);
  }
}

function info(msg){
  document.getElementById('info').textContent = msg;
}
