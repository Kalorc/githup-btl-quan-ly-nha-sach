document.addEventListener("DOMContentLoaded", async () => {
    if (!localStorage.getItem("token")) {
        document.getElementById("rentingList").innerHTML = 
            "<p>Vui lòng đăng nhập để xem danh sách sách đang thuê</p>";
        return;
    }

    const userId = localStorage.getItem("userId");

    try {
        const response = await apiRequest("GET", `/api/rent/list/${userId}`, null, true);
        
        let rentals = [];
        if (Array.isArray(response)) {
            rentals = response;
        } else if (response.data) {
            rentals = response.data;
        }

        const box = document.getElementById("rentingList");

        if (rentals.length === 0) {
            box.innerHTML = "<p>Bạn không đang thuê sách nào</p>";
            return;
        }

        box.innerHTML = rentals.map(rental => `
            <div class="item-box">
                <div>
                    <h3>Sách: ${rental.bookId}</h3>
                    <p>Người dùng: ${rental.userId}</p>
                    <p>Thời hạn: ${rental.days || 7} ngày</p>
                </div>
            </div>
        `).join("");
    } catch (error) {
        console.error("Lỗi khi tải danh sách thuê:", error);
        document.getElementById("rentingList").innerHTML = 
            "<p>Lỗi khi tải dữ liệu</p>";
    }
});
