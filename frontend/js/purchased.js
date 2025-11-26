document.addEventListener("DOMContentLoaded", async () => {
    if (!localStorage.getItem("token")) {
        document.getElementById("purchasedList").innerHTML = 
            "<p>Vui lòng đăng nhập để xem lịch sử mua hàng</p>";
        return;
    }

    const userId = localStorage.getItem("userId");

    try {
        const response = await apiRequest("GET", `/api/orders/history/${userId}`, null, true);
        
        let orders = [];
        if (Array.isArray(response)) {
            orders = response;
        } else if (response.data) {
            orders = response.data;
        }

        const box = document.getElementById("purchasedList");

        if (orders.length === 0) {
            box.innerHTML = "<p>Bạn chưa mua sản phẩm nào</p>";
            return;
        }

        box.innerHTML = orders.map(order => {
            const itemsHtml = order.items.map(item => 
                `<li>${item.productId} x${item.quantity} - ${item.price?.toLocaleString() || 0}đ</li>`
            ).join("");

            return `
            <div class="item-box">
                <div>
                    <h3>Đơn hàng #${order.id}</h3>
                    <p>Ngày mua: ${order.createdAt || 'N/A'}</p>
                    <p>Tổng tiền: ${order.total.toLocaleString()}đ</p>
                    <p>Chi tiết:</p>
                    <ul>${itemsHtml}</ul>
                </div>
            </div>
        `;
        }).join("");
    } catch (error) {
        console.error("Lỗi khi tải lịch sử mua hàng:", error);
        document.getElementById("purchasedList").innerHTML = 
            "<p>Lỗi khi tải dữ liệu</p>";
    }
});
