const $ = s => document.querySelector(s);

async function fetchProducts() {
    const query = `?q=${$('#q').value}&sortBy=${$('#sortBy').value}&order=${order.value}`;

    const cat = $('.cat.active .name').innerText.toLowerCase();
    const catParam = (cat === 'all products') ? '' : `&category=${cat}`;

    const res = await fetch(`http://localhost:3008/products${query}${catParam}`);
    const data = await res.json();


    render(data);
}

function render(data) {
    $('#cards').innerHTML = data.map(p => `
        <div class="card" data-id="${p.id}" data-name="${p.title}" data-price="${p.price}" data-img="${p.thumbnail}" data-desc="${p.description}">
            <div class="thumb">
                <img src="${p.thumbnail}">
            </div>
            <div class="body">
                <div class="title">${p.title}</div>
                <div class="row">
                    <div class="price">$${p.price}</div>
                    <button class="view-btn">View</button>
                </div>
            </div>
        </div>
    `).join('');
}


$('#catList').onclick = function(e) {
    const el = e.target.closest('.cat');
    if (!el) return;


    const active = $('.cat.active');
    if (active) active.classList.remove('active');
    el.classList.add('active');


    fetchProducts();
};


$('#cards').onclick = function(e) {
    const card = e.target.closest('.card');
    if (!card) return;

    const { id, name, price, img, desc } = card.dataset;

    $('.modal').classList.add('open');
    $('.modal').innerHTML = `
        <div class="modal-card">
            <img src="${img}">
            <h2>${name}</h2>
            <p>${desc}</p>
            <div class="row">
                <b>$${price}</b>
                <button class="btn danger" id="del">Delete Product</button>
                <button class="btn" id="cls">Close</button>
            </div>
        </div>
    `;

    $('#cls').onclick = () => $('.modal').classList.remove('open');

    $('#del').onclick = async () => {
        if (!confirm('Ջնջե՞նք')) return;
        await fetch(`http://localhost:3008/products/${id}`, { method: 'DELETE' });
        $('.modal').classList.remove('open');
        fetchProducts();
    };
};

$('#q').oninput = fetchProducts;
$('#sortBy').onchange = fetchProducts;
$('#order').onchange = fetchProducts;
$('#refresh').onclick = fetchProducts;

window.onload = fetchProducts;