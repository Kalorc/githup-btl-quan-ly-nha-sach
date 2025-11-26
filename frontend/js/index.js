document.addEventListener("DOMContentLoaded", () => {
    setupMenu();
});

// ===============================
// KIỂM TRA TOKEN USER
// ===============================
function isLoggedIn() {
    return localStorage.getItem("token") !== null;
}

// ===============================
// TẠO MENU TÙY THEO TRẠNG THÁI
// ===============================
function setupMenu() {
    const menu = document.querySelector(".dropdown-menu");
    if (!menu) return;

    menu.innerHTML = ""; // Xóa menu cũ

    if (!isLoggedIn()) {
        // ===== CHƯA ĐĂNG NHẬP =====
        menu.innerHTML += `
            <a href="index.html">Trang chủ</a>
            <a href="product.html">Sản phẩm</a>
            <a href="login.html">Đăng nhập</a>
        `;
    } else {
        // ===== ĐÃ ĐĂNG NHẬP =====
        menu.innerHTML += `
            <a href="index.html">Trang chủ</a>
            <a href="product.html">Sản phẩm</a>
            <a href="cart.html">Giỏ hàng</a>
            <a href="purchased.html">Sản phẩm đã mua</a>
            <a href="renting.html">Sách đang thuê</a>
            <a href="history.html">Lịch sử giao dịch</a>
            <a href="#" id="logoutBtn">Đăng xuất</a>
        `;

        // Gán logout
        const logoutBtn = document.getElementById("logoutBtn");
        logoutBtn.addEventListener("click", logout);
    }
}

// ===============================
// LOGOUT
// ===============================
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    alert("Đăng xuất thành công!");
    window.location.href = "login.html";
}
