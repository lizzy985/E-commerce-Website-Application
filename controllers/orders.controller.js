const stripe = require('stripe')('sk_test_51P31v2BWEi0mwJ5cuEaIo67Uo8bAmW1XBmstF3Yz97RIujWQLX6Adr44XS619TVs9VJuaWBXvye3OXuhHAxFxc7i00T8K3TPmP');


const Order = require('../models/order.model');
const User = require('../models/user.model');

async function getOrders(req, res, next) {
    try {
        const orders = await Order.findAllForUser(res.locals.uid);
        res.render('customer/orders/all-orders', {
          orders: orders,
        });
      } catch (error) {
        next(error);
      }
    
}

async function addOrder(req, res, next) {
    const cart = res.locals.cart;

    let userDocument;
    try{
        userDocument = await User.findById(res.locals.uid);
    }catch(error) {
        return next(error);
    }
    
    const order = new Order(cart, userDocument);

    try{
        await order.save();
    }catch(error) {
        next(error);
        return;
    }

    req.session.cart = null;

    //stripe
    const session = await stripe.checkout.sessions.create({
        line_items: cart.items.map(function(item) {
            return {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                // price: '{{PRICE_ID}}',
                price_data: {
                    currency: 'usd',
                    product_data:  {
                        name: item.product.title
                    },
                    // unit_amount_decimal: +item.product.price
                    unit_amount: +item.product.price.toFixed(2) * 100
                },
                quantity: item.quantity,
              };
        }),
        mode: 'payment',
        // success_url: `${YOUR_DOMAIN}/success.html`,
        success_url: `http://localhost:3000/orders/success`,
        cancel_url: `http://localhost:3000/oders/failure`,
    });
    
    res.redirect(303, session.url);

    // res.redirect('/orders');
    
}

function getSuccess(req, res){
    res.render('customer/orders/success');
}

function getFailure(req, res) {
    res.render('customer/orders/failure');
}

module.exports = {
    addOrder: addOrder,
    getOrders:getOrders,
    getSuccess: getSuccess,
    getFailure: getFailure,
}