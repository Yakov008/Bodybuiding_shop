document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    const payButton = document.querySelector('.pay-btn');
    payButton.addEventListener('click', () => {
        clearCart();
        renderCart();
    });
});

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const tableBody = document.querySelector('.products tbody');
    const totalPrice = document.querySelector('.total-price');
    let total = 0;

    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    if (cart.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.classList.add('empty');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 4;
        emptyCell.textContent = 'Корзина пуста';
        emptyRow.appendChild(emptyCell);
        tableBody.appendChild(emptyRow);
        document.querySelector('.pay-btn').remove();
        totalPrice.textContent = `0 руб`;
    } else {
        fetch('data/catalog.json')
            .then(response => response.json())
            .then(data => {
                cart.forEach(cartItem => {
                    const item = data.catalog.find(item => item.id === cartItem.id);
                    if (item) {
                        const row = document.createElement('tr');
                        const titleCell = document.createElement('td');
                        titleCell.textContent = item.title;
                        row.appendChild(titleCell);

                        const priceCell = document.createElement('td');
                        priceCell.textContent = item.price;
                        row.appendChild(priceCell);

                        const quantityCell = document.createElement('td');
                        const quantityInput = document.createElement('input');
                        quantityInput.type = 'number';
                        quantityInput.value = cartItem.count;
                        quantityInput.min = 1;
                        quantityInput.addEventListener('change', () => updateCartItemQuantity(item.id, quantityInput.value));
                        quantityCell.appendChild(quantityInput);

                        const increaseButton = document.createElement('button');
                        increaseButton.textContent = '+';
                        increaseButton.addEventListener('click', () => {
                            quantityInput.value = parseInt(quantityInput.value) + 1;
                            updateCartItemQuantity(item.id, quantityInput.value);
                        });
                        quantityCell.appendChild(increaseButton);

                        const decreaseButton = document.createElement('button');
                        decreaseButton.textContent = '-';
                        decreaseButton.addEventListener('click', () => {
                            const newQuantity = Math.max(0, parseInt(quantityInput.value) - 1);
                            if (newQuantity === 0) {
                                removeCartItem(item.id);
                            } else {
                                quantityInput.value = newQuantity;
                                updateCartItemQuantity(item.id, newQuantity);
                            }
                        });
                        quantityCell.appendChild(decreaseButton);

                        row.appendChild(quantityCell);

                        tableBody.appendChild(row);

                        total += parseFloat(item.price.replace(' руб.', '')) * parseInt(quantityInput.value);
                    }
                });

                totalPrice.textContent = `${total.toFixed(2)} руб`;
            })
            .catch(error => console.error('Ошибка загрузки данных:', error));
    }
}

function clearCart() {
    localStorage.removeItem('cart');
}

function updateCartItemQuantity(itemId, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(cartItem => cartItem.id === itemId);
    if (index !== -1) {
        cart[index].count = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }
}

function removeCartItem(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(cartItem => cartItem.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}
