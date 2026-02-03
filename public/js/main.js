import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Supabase config (user provided)
const SUPABASE_URL = 'https://lysegwfgoqxpevdqhpad.supabase.co'
const SUPABASE_KEY = 'sb_publishable_1dx2Awoe5jtsrMFuknLxXA_NRDmu6U6'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const productsContainer = document.querySelector('.products')
const cartCountEl = document.querySelector('.cart-count')
const searchInput = document.getElementById('search')
const categorySelect = document.getElementById('category')
let products = []
let cart = JSON.parse(localStorage.getItem('cart') || '[]')

function updateCartUI(){
  const count = cart.reduce((s, i) => s + (i.quantity || 1), 0)
  cartCountEl.textContent = count
  localStorage.setItem('cart', JSON.stringify(cart))
}

async function fetchProductsFromSupabase(){
  try{
    const { data, error } = await supabase.from('products').select('*')
    if(error){
      console.warn('Supabase error:', error)
      return []
    }
    return data || []
  }catch(e){
    console.warn('Fetch error', e)
    return []
  }
}

function renderProducts(list){
  productsContainer.innerHTML = ''
  list.forEach(p => {
    const el = document.createElement('article')
    el.className = 'product'
    el.innerHTML = `
      <img data-src="${p.image || p.img || ''}" alt="${p.title}" loading="lazy">
      <div class="title">${p.title}</div>
      <div class="price">${p.price || ''}</div>
      <div class="actions">
        <button class="btn primary add">Añadir</button>
        <button class="btn ghost view">Ver</button>
      </div>
    `

    el.querySelector('.add').addEventListener('click', () => {
      const found = cart.find(i => i.id === p.id)
      if(found) found.quantity = (found.quantity || 1) + 1
      else cart.push({ id: p.id, title: p.title, price: p.price, quantity: 1 })
      updateCartUI()
      el.animate([{ transform: 'scale(1)' }, { transform: 'scale(.98)' }, { transform: 'scale(1)' }], { duration: 260 })
    })

    el.querySelector('.view').addEventListener('click', () => openModal(p))

    productsContainer.appendChild(el)
  })

  observeLazyImages()
}

function observeLazyImages(){
  const imgs = document.querySelectorAll('img[data-src]')
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const img = entry.target
        img.src = img.dataset.src
        img.removeAttribute('data-src')
        o.unobserve(img)
      }
    })
  }, { rootMargin: '200px' })

  imgs.forEach(i => obs.observe(i))
}

function openModal(product){
  const modal = document.getElementById('product-modal')
  modal.setAttribute('aria-hidden', 'false')
  const body = modal.querySelector('.modal-body')
  body.innerHTML = `
    <img src="${product.image || product.img || ''}" alt="${product.title}" style="width:100%;height:auto;border-radius:.5rem;margin-bottom:1rem">
    <h3>${product.title}</h3>
    <p>${product.description || ''}</p>
    <div style="display:flex;gap:.5rem;margin-top:1rem">
      <button class="btn primary add">Añadir al carrito</button>
      <button class="btn ghost close">Cerrar</button>
    </div>
  `

  modal.querySelector('.modal-close').focus()

  modal.querySelector('.add').addEventListener('click', () => {
    const found = cart.find(i => i.id === product.id)
    if(found) found.quantity = (found.quantity || 1) + 1
    else cart.push({ id: product.id, title: product.title, price: product.price, quantity: 1 })
    updateCartUI()
  })

  modal.querySelector('.close').addEventListener('click', closeModal)
}

function closeModal(){
  const modal = document.getElementById('product-modal')
  modal.setAttribute('aria-hidden', 'true')
}

// CART & CHECKOUT
const cartBtn = document.querySelector('.cart')
const cartModal = document.getElementById('cart-modal')
const cartItemsEl = document.querySelector('.cart-items')
const cartTotalValue = document.querySelector('.cart-total-value')
const checkoutModal = document.getElementById('checkout-modal')
const checkoutForm = document.getElementById('checkout-form')
const checkoutMessage = document.querySelector('.checkout-message')

function openCart(){
  cartModal.setAttribute('aria-hidden', 'false')
  renderCartItems()
}

function closeCart(){
  cartModal.setAttribute('aria-hidden', 'true')
}

function renderCartItems(){
  cartItemsEl.innerHTML = ''
  if(cart.length === 0){
    cartItemsEl.innerHTML = '<p>Tu carrito está vacío.</p>'
    cartTotalValue.textContent = '€0'
    return
  }
  let total = 0
  cart.forEach(i => {
    const row = document.createElement('div')
    row.className = 'cart-row'
    row.innerHTML = `
      <div class="cart-row-title">${i.title}</div>
      <div class="cart-row-qty">x${i.quantity}</div>
      <div class="cart-row-price">${i.price || ''}</div>
      <div class="cart-row-actions"><button class="btn ghost remove" data-id="${i.id}">Quitar</button></div>
    `
    row.querySelector('.remove').addEventListener('click', () => {
      cart = cart.filter(x => x.id !== i.id)
      updateCartUI()
      renderCartItems()
    })
    cartItemsEl.appendChild(row)
    const priceNumber = parseFloat((i.price || '0').replace(/[^0-9.]/g, '')) || 0
    total += priceNumber * (i.quantity || 1)
  })
  cartTotalValue.textContent = `€${total.toFixed(2)}`
}

cartBtn?.addEventListener('click', openCart)
cartModal?.querySelector('.close-cart')?.addEventListener('click', closeCart)
cartModal?.querySelector('.modal-close')?.addEventListener('click', closeCart)

// Checkout
cartModal?.querySelector('.checkout-btn')?.addEventListener('click', () => {
  closeCart()
  checkoutModal.setAttribute('aria-hidden', 'false')
})

checkoutModal?.querySelector('.modal-close')?.addEventListener('click', () => checkoutModal.setAttribute('aria-hidden', 'true'))
checkoutModal?.querySelector('#cancel-checkout')?.addEventListener('click', () => checkoutModal.setAttribute('aria-hidden', 'true'))

checkoutForm?.addEventListener('submit', async (e) => {
  e.preventDefault()
  const form = new FormData(checkoutForm)
  const payload = {
    customer_name: form.get('name'),
    customer_email: form.get('email'),
    notes: form.get('notes'),
    items: cart,
    total: cart.reduce((s, i) => s + (parseFloat((i.price || '0').replace(/[^0-9.]/g, '')) || 0) * (i.quantity || 1), 0),
    status: 'pending',
    created_at: new Date().toISOString()
  }

  checkoutMessage.textContent = 'Procesando pedido...'

  try{
    // Try to insert order into Supabase 'orders' table. If RLS prevents it, we fallback.
    const { data, error } = await supabase.from('orders').insert([payload])
    if(error){
      console.warn('Supabase insert error', error)
      // fallback: save locally
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      orders.push(payload)
      localStorage.setItem('orders', JSON.stringify(orders))
      checkoutMessage.textContent = 'Pedido guardado localmente (supabase no permitió insert). Revisa la consola.'
    } else {
      checkoutMessage.textContent = 'Pedido enviado correctamente. ¡Gracias!'
      cart = []
      updateCartUI()
    }
  }catch(e){
    console.warn('Order submit error', e)
    checkoutMessage.textContent = 'Error al enviar el pedido. Se guardó localmente.'
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    orders.push(payload)
    localStorage.setItem('orders', JSON.stringify(orders))
  }

  setTimeout(() => {
    checkoutModal.setAttribute('aria-hidden', 'true')
    checkoutMessage.textContent = ''
    checkoutForm.reset()
  }, 1500)
})

// Search and filter
function applyFilters(){
  const q = searchInput.value.toLowerCase().trim()
  const cat = categorySelect.value
  const filtered = products.filter(p => {
    const matchesQ = !q || (p.title && p.title.toLowerCase().includes(q)) || (p.description && p.description.toLowerCase().includes(q))
    const matchesCat = !cat || (p.category === cat)
    return matchesQ && matchesCat
  })
  renderProducts(filtered)
}

// Init
updateCartUI()
searchInput?.addEventListener('input', applyFilters)
categorySelect?.addEventListener('change', applyFilters)

// Keyboard focus for modal
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') closeModal()
})

async function init(){
  // Fetch products from Supabase
  const data = await fetchProductsFromSupabase()
  if(data.length > 0){
    products = data
    // Populate category select
    const cats = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
    cats.forEach(c => categorySelect.appendChild(new Option(c, c)))
  } else {
    // fallback demo data
    products = [
      { id: 1, title: 'Vino Tinto Reserva', price: '€29', img: 'https://images.unsplash.com/photo-1547592166-5e3adfeba12b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=0d1116f9c9c4d7e1563fd2c2e06b2bb8', description: 'Vino excepcional con notas de cereza', category: 'Vinos' },
      { id: 2, title: 'Cava Brut', price: '€19', img: 'https://images.unsplash.com/photo-1514361892637-a5c40f7a2b96?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=9b460cbe7268d6ed09c6d086da58d7b9', description: 'Cava ideal para celebraciones', category: 'Vinos' },
      { id: 3, title: 'Casa rural fin de semana', price: '€199', img: 'https://images.unsplash.com/photo-1505691723518-36a6f3b4b3a9?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=af3e7b2f1539a5cc8a4b05eefa9ed8f9', description: 'Disfruta un fin de semana en una casa rural', category: 'Renta' }
    ]
    const cats = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
    cats.forEach(c => categorySelect.appendChild(new Option(c, c)))
  }
  renderProducts(products)
}

init()
