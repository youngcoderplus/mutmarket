import { cart, removeFromCart, updateDeliveryOption } from "../../data/cart.js";    
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { hello } from " https://unpkg.com/supersimpledev@1.0.1/hello.esm.js";
import dayjs from ' https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions, getDeliveryOption} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js"; 

/*hello();

const today = dayjs();
const deliveryDate = today.add(7, 'days'); 
console.log(deliveryDate.format('dddd,MMMM D'));*/



export function renderOrderSummary(){

    let cartSummaryHTML = ' ';

    cart.forEach( (cartItem) => {

        const productId = cartItem.productId;
        
        const matchingProduct = getProduct(productId);

       /* products.forEach( (product) => {
            if(product.id === productId){
                matchingProduct = product; 
            }
        });*/

        //console.log(matchingProduct);

        const deliveryOptionId = cartItem.deliveryOptionId;

        const deliveryOption = getDeliveryOption(deliveryOptionId);
        /*deliveryOptions.forEach( (option) => {
            if(option.id === deliveryOptionId){
                deliveryOption = option;
            }
        });*/

            const today = dayjs();
            const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
            const dateString = deliveryDate.format('dddd, MMMM D');


        cartSummaryHTML+=

    `
    <div class="cart-item-container 
        js-cart-item-container-${matchingProduct.id}">
        <!-- Delivery date hidden 
            <div class="delivery-date">
            Delivery date: ${dateString}
        </div>
        -->

        <div class="cart-item-details-grid">
            <img class="product-image"
            src="${matchingProduct.image}">

            <div class="cart-item-details">
            <div class="product-name">
                ${matchingProduct.name}
            </div>
            ${cartItem.brand ? `
            <div class="product-brand">
                ${cartItem.brand}
            </div>
            ` : ''}
            <div class="product-price">
            ${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
                <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary">
                Update
                </span>
                <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
                </span>
            </div>
            </div>

            <div class="delivery-options">
            <div class="delivery-options-title">
                Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
            </div>
        </div>
        </div>
    `;
    });

    function deliveryOptionsHTML(matchingProduct, cartItem){
        let html = '';

        deliveryOptions.forEach( (deliveryOption) => {
            const today = dayjs();
            const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
            const dateString = deliveryDate.format('dddd, MMMM D');

            const priceString = deliveryOption.priceCents === 0 
            ? 'FREE' 
            : `$${formatCurrency(deliveryOption.priceCents)} -`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionId ;

        html +=  `<div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
                <input type="radio"
                class="delivery-option-input"
                ${isChecked ? 'checked' : ''}
                name="${matchingProduct.id}-delivery-option-1">
                <div>
                <!-- Delivery date hidden -->
                <div class="delivery-option-price">
                    ${priceString} Shipping
                </div>
                </div>
            </div>`
    })
        return html;
    };



    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

    //console.log(cartSummaryHTML);

    document.querySelectorAll('.js-delete-link')
    .forEach( (link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);
            console.log(cart);

        const container = document.querySelector(`.js-cart-item-container-${productId}`)
        container.remove();

        renderPaymentSummary();
        });            
        });

        document.querySelectorAll('.js-delivery-option')
        .forEach((element) => {
            element.addEventListener('click', () => {
                const {productId, deliveryOptionId} = element.dataset;
                updateDeliveryOption(productId, deliveryOptionId);
                renderOrderSummary();
                renderPaymentSummary();
            });
        }); 
    }

    