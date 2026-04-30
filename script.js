// CART SYSTEM - FOR ALL PAGES
document.addEventListener('DOMContentLoaded', function() {

    // Helper function: Converts price string to float
    function parsePrice(priceText) {
        // Handles prices like "1.299,99 TL"
        priceText = priceText.replace(/[^\d,.-]/g, ''); // Remove TL, spaces, and other non-numeric characters
        priceText = priceText.replace(/\./g, '');       // Remove thousand separator (.)
        if (priceText.indexOf(',') > -1) {
            priceText = priceText.replace(',', '.');    // Convert decimal comma to dot
        }
        return parseFloat(priceText); // Parse string to float
    }

    // 1. CART DATA STRUCTURE
    let cart = JSON.parse(localStorage.getItem('jewelry-cart')) || [];
    
    // 2. DOM ELEMENTS
    const cartIcon = document.querySelector('.fa-shopping-cart');
    const cartModal = document.querySelector('.cart-modal');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total span');
    
    // 3. CREATE CART COUNTER IF IT DOESN'T EXIST
    if (!document.querySelector('.cart-count')) {
        const counter = document.createElement('span');
        counter.className = 'cart-count';
        counter.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        cartIcon.appendChild(counter);
    }
    const cartCount = document.querySelector('.cart-count');

    // 4. MAIN FUNCTION: UPDATE CART DISPLAY AND STORAGE
    function updateCart() {
        // Update cart counter
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Render cart items in modal
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <h3>${item.name}</h3>
                        <div class="price">${item.price}TL x ${item.quantity}</div>
                        <button class="remove-btn" data-index="${index}">remove</button>
                    </div>
                </div>
            `;
        });
        
        // Display total price
        cartTotal.textContent = totalPrice.toFixed(2);
        
        // Store updated cart in localStorage
        localStorage.setItem('jewelry-cart', JSON.stringify(cart));
    }

    // 5. ADD PRODUCTS TO CART (WORKS ON ALL PAGES)
    function setupAddToCart() {
        document.querySelectorAll('.cart-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const productCard = this.closest('.box');
                
                // Get and parse price from product card
                let priceContainer = productCard.querySelector('.price');
                let priceText = priceContainer.childNodes[0].textContent.trim(); 
                let price = parsePrice(priceText);

                // Create product object
                const product = {
                    name: productCard.querySelector('h3').textContent,
                    price: price,  
                    image: productCard.querySelector('img').src,
                    quantity: parseInt(productCard.querySelector('.qty-input').value) || 1
                };
                
                // Check if product already exists in cart
                const existingIndex = cart.findIndex(item => item.name === product.name);
                if (existingIndex > -1) {
                    cart[existingIndex].quantity += product.quantity;
                } else {
                    cart.push(product);
                }
                
                // Update UI and show notification
                updateCart();
                showAlert(`${product.name} added successfully to cart!`);
            });
        });
    }

    // 6. QUANTITY CONTROL (PRODUCTS PAGE)
    function setupQuantityControls() {
        document.querySelectorAll('.qty-plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.previousElementSibling;
                input.value = parseInt(input.value) + 1;
            });
        });
        
        document.querySelectorAll('.qty-minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.nextElementSibling;
                if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
            });
        });
    }

    // 7. FILTER FUNCTIONALITY (PRODUCTS PAGE)
    function setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        if (filterButtons.length > 0) {
            filterButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Toggle active button state
                    filterButtons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Filter product boxes by category
                    const category = this.dataset.filter;
                    document.querySelectorAll('.box').forEach(box => {
                        box.style.display = (category === 'all' || box.dataset.category === category) 
                            ? 'block' 
                            : 'none';
                    });
                });
            });
        }
    }

    // 8. CART MODAL CONTROLS
    function setupCartModal() {
        // Open cart modal
        cartIcon.addEventListener('click', () => {
            cartModal.style.display = 'flex';
            updateCart();  // Ensure latest cart info is shown
        });
        
        // Close modal on clicking 'X'
        closeCart.addEventListener('click', () => cartModal.style.display = 'none');
       
        // Close modal when clicking outside content area
        window.addEventListener('click', (e) => e.target === cartModal && (cartModal.style.display = 'none'));
        
        // Remove item from cart
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-btn')) {
                cart.splice(e.target.dataset.index, 1);
                updateCart();
            }
        });
    }

    // 9. ALERT / NOTIFICATION SYSTEM
    function showAlert(message) {
        const alert = document.createElement('div');
        alert.className = 'cart-alert';
        alert.innerHTML = message;
        document.body.appendChild(alert);
        
        // Animate and auto-remove alert
        setTimeout(() => alert.classList.add('show'), 10);
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        }, 2000);
    }

    // 10. INITIALIZE APPLICATION
    setupAddToCart();
    setupQuantityControls();
    setupFilters();
    setupCartModal();
    updateCart();  // Ensure initial UI reflects localStorage
});

