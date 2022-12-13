import { menuArray } from './data.js'

const order = document.getElementById('order')
const orderForm = document.getElementById('place-order-form')
const placedOrderMsg = document.getElementById('placed-order-msg')

let orderedItemArray = []

document.addEventListener('click', (e) => {
    e.target.dataset.add ? handleAddClick(e.target.dataset.add) : 
    e.target.classList[0] === 'remove' ? handleRemoveClick(e.target.dataset.remove) : ''
})
      

function handleAddClick(id) {
    const targetMenuItem = menuArray.find(item => item.id === id)
    
    if (orderedItemArray.includes(targetMenuItem)){
        targetMenuItem.quantity++
    } 
    else {
        targetMenuItem.quantity++
        orderedItemArray.unshift(targetMenuItem)
    }
    renderOrder()
}

function getTotalCost(items) {
    let total = 0
    
    total = items.map(item => {
        return item.quantity * item.price
    })
    total = total.reduce((prevNum, curNum) => {
        return prevNum + curNum
    }, 0)
    
    return total
}

function handleRemoveClick(id) {
    const targetItem = orderedItemArray.find(item => item.id === id)
    
    if (targetItem.quantity > 1) {
        targetItem.quantity--
    }
    else {
        targetItem.quantity = 0
        orderedItemArray =  orderedItemArray.filter(item => item.id !== id)
    }
    renderOrder()
}

function closeModal() {
    modal.classList.add('hidden')
    order.classList.remove('hidden')
}

function displayPlacedOrderMsg() {
    placedOrderMsg.classList.remove('hidden')
    order.classList.add('hidden')
}

function displayModal() {
    order.classList.add('hidden')
    modal.classList.remove('hidden')  
}

function submitOrderForm() {
    const firstNameHtml = document.getElementById('firstName')
    
    let orderData = new FormData(orderForm)
    let firstName = orderData.get('firstName')
    // capitalizes first letter of name
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1)
    firstNameHtml.innerText = firstName
    
    closeModal()
    displayPlacedOrderMsg()
    
    setTimeout(() => {
        placedOrderMsg.classList.add('hidden')
    }, 2000)
    
    orderedItemArray.forEach(item => item.quantity = 0)
    orderedItemArray = []
    renderOrder()
}

function getCheckoutModal() {
    const modal = document.getElementById('modal')
    const closeModalBtn = document.getElementById('close-modal-btn')
    
    displayModal()
    
    closeModalBtn.addEventListener('click', closeModal)
    
    orderForm.addEventListener('submit', (e)=> {
        event.preventDefault()
        submitOrderForm()
    })
    
    document.getElementById('firstNameInput').value = ''
    document.getElementById('cardNumberInput').value = ''
    document.getElementById('cvvInput').value = ''
}

function renderOrder() {
    let orderHtml = ''
    let orderMessage = ''
    // Toggles the display of the order div (if no items in cart; display = hidden)
    orderedItemArray.length === 0 ?  
        (order.classList.add('hidden'))
        :(order.classList.remove('hidden'),
        orderMessage = 'Your order')

    
    orderedItemArray.forEach(item => {
       orderHtml += `
            <div class="order-items">
            
                <div class="order-items-container">
                    <h2 class="order-item-name">${item.name}</h2>
                    <p class="remove" data-remove=${item.id}>Remove</p>
                </div>
                <p class="order-item-price">
                    ${item.quantity*item.price}
                </p>
                
            </div>
        `
    })
    
    order.innerHTML = `
        <h2 class='your-order'>${orderMessage}</h2>
        
            ${orderHtml}
            
        <div class="bill">
            ${orderMessage !== '' ? '<p>Total: </p>': ""}$${getTotalCost(orderedItemArray)}
        </div>
        
        <button class="order-btn" id="place-order-btn">Place order</button>
    `
    document.getElementById('place-order-btn').addEventListener('click', getCheckoutModal)
}

function getMenuHtml() {
    let menuHtml = ''

    menuArray.forEach(item => {
        menuHtml += `
            <div class="item">
                <div class="item-img">${item.emoji}</div>
                <div class="item-info">
                    <h2 class="item-name">${item.name}</h2>
                    <p class="item-description">${item.ingredients}</p>
                    <p class="item-price">${item.price}</p>
                </div>
                <div class="item-btn" data-add="${item.id}">+</div>
            </div>`
    })
    
    return menuHtml
}

function render() {
    document.getElementById('menu').innerHTML = getMenuHtml()
}

render()
