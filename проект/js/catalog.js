document.addEventListener('DOMContentLoaded', () => {
    let cart = localStorage.getItem('cart');
    if (cart) {
        cart = JSON.parse(cart);
        if (!Array.isArray(cart)) {
            cart = [];
        }
    } else {
        cart = [];
    }

    const productContainer = document.querySelector('.products');

    fetch('data/catalog.json')
        .then(response => response.json())
        .then(data => {
            console.log("Данные из каталога:", data);
            const catalog = data.catalog;

            catalog.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item');

                const itemImage = document.createElement('img');
                itemImage.src = item.image;
                itemDiv.appendChild(itemImage);

                const itemTitle = document.createElement('p');
                itemTitle.textContent = item.title;
                itemDiv.appendChild(itemTitle);

                const itemPrice = document.createElement('p');
                itemPrice.textContent = `Цена: ${item.price}`;
                itemDiv.appendChild(itemPrice);

                const itemButton = document.createElement('button');
                itemButton.classList.add('secondary');
                if (cart.some(cartItem => cartItem.id === item.id)) {
                    itemButton.textContent = 'Удалить из корзины';
                    itemButton.addEventListener('click', () => removeFromCart(item.id, itemDiv));
                } else {
                    itemButton.textContent = 'В корзину';
                    itemButton.addEventListener('click', () => addToCart(item.id, itemDiv));
                }
                itemDiv.appendChild(itemButton);

                productContainer.appendChild(itemDiv);
            });
        })
        .catch(error => console.error('Ошибка загрузки данных:', error));
});

function addToCart(itemId, itemDiv) {
    let cart = localStorage.getItem('cart');
    if (cart) {
        cart = JSON.parse(cart);
        if (!Array.isArray(cart)) {
            cart = [];
        }
    } else {
        cart = [];
    }

    const index = cart.findIndex(cartItem => cartItem.id === itemId);
    if (index !== -1) {
        cart[index].count++;
    } else {
        cart.push({ id: itemId, count: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    const button = itemDiv.querySelector('button');
    button.textContent = 'Удалить из корзины';
    button.removeEventListener('click', addToCart);
    button.addEventListener('click', () => removeFromCart(itemId, itemDiv));
}

function removeFromCart(itemId, itemDiv) {
    let cart = localStorage.getItem('cart');
    if (cart) {
        cart = JSON.parse(cart);
        if (!Array.isArray(cart)) {
            cart = [];
        }
    } else {
        cart = [];
    }

    const index = cart.findIndex(cartItem => cartItem.id === itemId);
    if (index !== -1) {
        cart[index].count--;
        if (cart[index].count === 0) {
            cart = cart.filter(cartItem => cartItem.id !== itemId);
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    const button = itemDiv.querySelector('button');
    if (!cart.some(cartItem => cartItem.id === itemId)) {
        button.textContent = 'В корзину';
        button.removeEventListener('click', removeFromCart);
        button.addEventListener('click', () => addToCart(itemId, itemDiv));
    }
}