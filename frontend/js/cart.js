document.addEventListener("DOMContentLoaded", () => {
    // Load cart từ localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    loadCart(cart);
});

function loadCart(cart) {
    const table = document.querySelector(".cart-table");

    let html = `
        <div class="cart-row cart-header">
            <div class="cart-col-product">Sản phẩm</div>
            <div class="cart-col">Giá</div>
            <div class="cart-col">Số lượng</div>
            <div class="cart-col">Thành tiền</div>
        </div>
    `;

    let total = 0;

    cart.forEach(item => {
        let money = item.qty * item.price;
        total += money;

        html += `
        <div class="cart-row">
            <div class="cart-col-product">
                <img src="${item.image}" class="cart-img">
                <span>${item.name}</span>
            </div>
            <div class="cart-col">${item.price.toLocaleString()}đ</div>
            <div class="cart-col">${item.qty}</div>
            <div class="cart-col">${money.toLocaleString()}đ</div>
        </div>
        `;
    });

    table.innerHTML = html;

    document.querySelector(".cart-summary").innerHTML = `
        <p><strong>Tạm tính:</strong> ${total.toLocaleString()}đ</p>
        <p><strong>Phí vận chuyển:</strong> 0đ</p>
        <hr>
        <h3>Tổng cộng: ${total.toLocaleString()}đ</h3>
        <button class="checkout-btn" onclick="checkoutCart()">Thanh toán</button>
    `;
}

async function checkoutCart() {
    if (!localStorage.getItem("token")) {
        alert("Vui lòng đăng nhập trước!");
        window.location.href = "login.html";
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length === 0) {
        alert("Giỏ hàng trống!");
        return;
    }

    const userId = localStorage.getItem("userId");
    const items = cart.map(item => ({
        productId: item.id,
        quantity: item.qty
    }));

    try {
        const response = await apiRequest("POST", "/api/orders/create", {
            userId: userId,
            items: items
        }, true);

        if (response.success) {
            alert("Đặt hàng thành công!");
            localStorage.removeItem("cart");
            window.location.href = "purchased.html";
        } else {
            alert(response.message || "Lỗi đặt hàng!");
        }
    } catch (error) {
        console.error("Lỗi checkout:", error);
        alert("Lỗi khi kết nối server!");
    }
}
