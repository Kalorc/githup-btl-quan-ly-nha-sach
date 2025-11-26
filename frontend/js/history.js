document.addEventListener("DOMContentLoaded", async () => {
    if (!localStorage.getItem("token")) {
        document.getElementById("historyList").innerHTML = 
            "<p>Vui lòng đăng nhập để xem lịch sử giao dịch</p>";
        return;
    }

    const userId = localStorage.getItem("userId");

    try {
        // Lấy danh sách đơn hàng và thuê
        const ordersRes = await apiRequest("GET", `/api/orders/history/${userId}`, null, true);
        const rentalsRes = await apiRequest("GET", `/api/rent/list/${userId}`, null, true);

        let orders = Array.isArray(ordersRes) ? ordersRes : ordersRes.data || [];
        let rentals = Array.isArray(rentalsRes) ? rentalsRes : rentalsRes.data || [];

        let historyItems = [];

        // Thêm orders
        if (orders && orders.length > 0) {
            orders.forEach(order => {
                historyItems.push({
                    title: `Đơn mua #${order.id}`,
                    price: order.total,
                    type: "Mua",
                    date: order.createdAt,
                    image: "assets/abc.png"
                });
            });
        }

        // Thêm rentals
        if (rentals && rentals.length > 0) {
            rentals.forEach(rental => {
                historyItems.push({
                    title: `Thuê: ${rental.bookId}`,
                    price: 0,
                    type: "Thuê",
                    date: "N/A",
                    image: "assets/abc.png"
                });
            });
        }

        const box = document.getElementById("historyList");

        if (historyItems.length === 0) {
            box.innerHTML = "<p>Không có lịch sử giao dịch nào</p>";
            return;
        }

        box.innerHTML = historyItems.map(item => `
            <div class="item-box">
                <img src="${item.image}" class="item-img">
                <div>
                    <h3>${item.title}</h3>
                    <p>Loại: ${item.type}</p>
                    <p>Giá: ${item.price.toLocaleString()}đ</p>
                    <p>Ngày: ${item.date}</p>
                </div>
            </div>
        `).join("");
    } catch (error) {
        console.error("Lỗi khi tải lịch sử giao dịch:", error);
        document.getElementById("historyList").innerHTML = 
            "<p>Lỗi khi tải dữ liệu</p>";
    }
});
