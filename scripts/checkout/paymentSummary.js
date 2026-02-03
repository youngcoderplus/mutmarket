import {cart} from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import {getDeliveryOption} from '../../data/deliveryOptions.js';
import {formatCurrency} from '../utils/money.js';

export function renderPaymentSummary(){
    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        productPriceCents += product.priceCents * cartItem.quantity;

        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;
    });

    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = 0; //totalBeforeTaxCents * 0.1;
    const totalCents = totalBeforeTaxCents + taxCents;

    const paymentSummaryHTML = `
        <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (3):</div>
            <div class="payment-summary-money">ksh${formatCurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">ksh${formatCurrency(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">ksh${formatCurrency(totalBeforeTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">ksh${formatCurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">ksh${formatCurrency(totalCents)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
    `
    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

    document.querySelector('.place-order-button').addEventListener('click', () => {
        sendOrderToWhatsApp(totalCents);
    });
}

function sendOrderToWhatsApp(totalCents) {
    let message = "🛒 *Order Details*\n\n";
    
    // Collect item names and quantities
    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        const brandText = cartItem.brand ? ` (${cartItem.brand})` : '';
        message += `• ${product.name}${brandText} (Qty: ${cartItem.quantity})\n`;
    });
    
    // Add total
    message += `\n*Total: ksh${formatCurrency(totalCents)}*`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp URL (works for web)
    const whatsappURL = `https://wa.me/254115955552?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
}