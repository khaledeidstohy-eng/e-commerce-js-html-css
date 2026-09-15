





let cart = []; // { id, title, price, quantity }
let currentPage = 1;
const PRODUCTS_PER_PAGE = 6;
let visibleCards = []; // cards after filtering/sorting


const productsGrid = document.getElementById('productsGrid');
const allCards = Array.from(productsGrid.querySelectorAll('.product-card'));
const paginationEl = document.getElementById('pagination');
const categorySelect = document.getElementById('categorySelect');
const searchInput = document.getElementById('searchInput');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
const applyFiltersBtn = document.getElementById('applyFilters');
const sortSelect = document.getElementById('sortSelect');

const cartItemsList = document.getElementById('cartItemsList');
const totalQuantityEl = document.getElementById('totalQuantity');
const totalPriceEl = document.getElementById('totalPrice');

const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

function populateCategories() {
  const categories = [...new Set(allCards.map(card => card.dataset.category))];
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
}


function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const minPrice = parseFloat(minPriceInput.value) || 0;
  const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

  visibleCards = allCards.filter(card => {
    const title = card.dataset.title.toLowerCase();
    const cardCategory = card.dataset.category;
    const price = parseFloat(card.dataset.price);

    const matchesSearch = title.includes(searchTerm);
    const matchesCategory = category === 'all' || cardCategory === category;
    const matchesPrice = price >= minPrice && price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  applySort();
  currentPage = 1;
  renderPage(currentPage);
}

function applySort() {
  const sortValue = sortSelect.value;
  if (sortValue === 'asc') {
    visibleCards.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
  } else if (sortValue === 'desc') {
    visibleCards.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
  }
}


function renderPage(page) {
  currentPage = page;

  
  allCards.forEach(card => card.style.display = 'none');

  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;
  const pageCards = visibleCards.slice(start, end);

  pageCards.forEach(card => {
    card.style.display = 'flex';
    productsGrid.appendChild(card); 
  });

  renderPagination();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderPagination() {
  paginationEl.innerHTML = '';
  const totalPages = Math.ceil(visibleCards.length / PRODUCTS_PER_PAGE);
  if (totalPages <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Previous';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => renderPage(currentPage - 1));
  paginationEl.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.addEventListener('click', () => renderPage(i));
    paginationEl.appendChild(btn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => renderPage(currentPage + 1));
  paginationEl.appendChild(nextBtn);
}


function addToCart(card) {
  const id = card.dataset.id;
  const title = card.dataset.title;
  const price = parseFloat(card.dataset.price);

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, title, price, quantity: 1 });
  }
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function renderCart() {
  cartItemsList.innerHTML = '';
  let totalQuantity = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    totalQuantity += item.quantity;
    totalPrice += item.quantity * item.price;

    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.title} - $${item.price} x ${item.quantity}</span>
      <button data-id="${item.id}">Remove</button>
    `;
    cartItemsList.appendChild(li);
  });

  totalQuantityEl.textContent = totalQuantity;
  totalPriceEl.textContent = totalPrice.toFixed(2);
}


function openModal(card) {
  const img = card.querySelector('img').src;
  const title = card.dataset.title;
  const description = card.dataset.description;
  const category = card.dataset.category;
  const price = card.dataset.price;
  const rate = card.dataset.rate;
  const count = card.dataset.count;

  modalContent.innerHTML = `
    <img src="${img}" alt="${title}">
    <h2>${title}</h2>
    <p>${description}</p>
    <p>Category: ${category}</p>
    <p class="price">Price: $${price}</p>
    <p>Rating: ${rate} (${count} reviews)</p>
  `;
  modalOverlay.classList.add('active');
}

function closeModal() {
  modalOverlay.classList.remove('active');
}

applyFiltersBtn.addEventListener('click', applyFilters);
sortSelect.addEventListener('change', () => {
  applySort();
  renderPage(1);
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

productsGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.product-card');
  if (!card) return;

  if (e.target.tagName === 'IMG' || e.target.classList.contains('btn-view')) {
    openModal(card);
  } else if (e.target.classList.contains('btn-add')) {
    addToCart(card);
  }
});

cartItemsList.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    removeFromCart(e.target.dataset.id);
  }
});


populateCategories();
visibleCards = [...allCards];
renderPage(1);






