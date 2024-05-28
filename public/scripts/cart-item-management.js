

const cartItemUpdatedFormElements = document.querySelectorAll('.cart-item-management');
const cartTotalPriceElement = document.getElementById('cart-total-price');
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');

async function updateCartItem(event){
    event.preventDefault();

    const form = event.target;

    const productId = form.dataset.productid;
    const csrfToken = form.dataset.csrf;
    const quantity = form.firstElementChild.value;

    let response;
    try{
        response = await fetch('/cart/items', {
            method: 'PATCH',
            body: JSON.stringify({
                productId: productId,
                quantity: quantity, //cart.controllers.js里const updatedItemData = cart.updateItem(req.body.productId, req.body.quantity);
                _csrf: csrfToken
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }catch(error) {
        alert('Something went wrong!');
        return;
    }

    if(!response.ok) {
        alert('Something went wrong!');
        return;
    }

    const responseData = await response.json();//decode json to javascript

    if(responseData.updatedCartData.updatedItemPrice === 0) {
        form.parentElement.parentElement.remove();
    }else {
        const cartItemTotalPriceElement = form.parentElement.querySelector('.cart-item-price');
        cartItemTotalPriceElement.textContent = responseData.updatedCartData.updatedItemPrice.toFixed(2);
    }
    


    // const cartTotalPriceElement = document.getElementById('cart-total-price');

    cartTotalPriceElement.textContent = responseData.updatedCartData.newTotalPrice.toFixed(2);

    // const cartBadge = document.querySelector('.nav-items .badge');
    for (const cartBadgeElement of cartBadgeElements) {
        cartBadgeElement.textContent = responseData.updatedCartData.newTotalQuantity;
    }
    
}

for(const formElement of cartItemUpdatedFormElements) {
    formElement.addEventListener('submit', updateCartItem);
}