// ============================================
// API CONFIG
// ============================================

// Chế độ fake (test giao diện khi chưa có backend)
let USE_FAKE_API = true;

// Khi bạn có backend thật (Spring Boot)
// ==> đổi lại thành:  USE_FAKE_API = false;
const BASE_URL = "http://localhost:8080";

// ============================================
// HÀM GỌI API CHUẨN REST (REAL API hoặc FAKE API)
// ============================================
async function apiRequest(method, url, body = null, requireAuth = false) {

    // =======================
    // 🌐 GỌI API THẬT
    // =======================
    if (!USE_FAKE_API) {
        const headers = { "Content-Type": "application/json" };

        if (requireAuth) {
            headers["Authorization"] = "Bearer " + localStorage.getItem("token");
        }

        const res = await fetch(BASE_URL + url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });

        return res.json();
    }

    // =======================
    // 🧪 FAKE API (không backend)
    // =======================
    return fakeApi(method, url, body);
}


// ============================================
// FAKE API – chạy bằng localStorage
// ============================================
function fakeApi(method, url, body) {

    console.log("🧪 Fake API called:", method, url, body);

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    // ---------------------------
    // ĐĂNG NHẬP
    // ---------------------------
    if (url === "/api/auth/login" && method === "POST") {
        const user = users.find(
            (u) => u.email === body.email && u.password === body.password
        );

        if (!user) {
            return { success: false, message: "Sai email hoặc mật khẩu!" };
        }

        return {
            success: true,
            message: "Đăng nhập thành công",
            token: "fake-token-" + user.email,
            userId: user.id
        };
    }

    // ---------------------------
    // ĐĂNG KÝ
    // ---------------------------
    if (url === "/api/auth/register" && method === "POST") {
        if (users.some((u) => u.email === body.email)) {
            return { success: false, message: "Email đã tồn tại!" };
        }

        const newUser = {
            id: Math.floor(Math.random() * 10000),
            fullName: body.fullName,
            email: body.email,
            password: body.password, // In fake API, we store plain text. In real backend, it's BCrypt encoded
            role: "USER"
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        return { success: true, message: "Đăng ký thành công!", userId: newUser.id };
    }

    // ---------------------------
    // LẤY DANH SÁCH SẢN PHẨM
    // ---------------------------
    if (url === "/api/products" && method === "GET") {
        return sampleProducts;
    }

    // ---------------------------
    // LẤY CHI TIẾT SẢN PHẨM
    // ---------------------------
    if (url.startsWith("/api/products/") && method === "GET") {
        const id = url.replace("/api/products/", "");
        const product = sampleProducts.find(p => p.id === id);
        return product || { error: "Sản phẩm không tìm thấy" };
    }

    // ---------------------------
    // TẠO ĐƠN HÀNG (CHECKOUT)
    // ---------------------------
    if (url === "/api/orders/create" && method === "POST") {
        if (!body.userId || !body.items || body.items.length === 0) {
            return { success: false, message: "Dữ liệu không hợp lệ" };
        }

        let orders = JSON.parse(localStorage.getItem("orders") || "[]");
        let total = 0;

        // Tính tổng tiền
        body.items.forEach(item => {
            const product = sampleProducts.find(p => p.id === item.productId);
            if (product) {
                total += product.price * item.quantity;
            }
        });

        const newOrder = {
            id: "ORD" + Date.now(),
            userId: body.userId,
            items: body.items,
            total: total,
            createdAt: new Date().toISOString(),
            status: "pending"
        };

        orders.push(newOrder);
        localStorage.setItem("orders", JSON.stringify(orders));

        return {
            success: true,
            message: "Đơn hàng được tạo thành công",
            orderId: newOrder.id,
            total: total
        };
    }

    // ---------------------------
    // LẤY LỊCH SỬ ĐẶT HÀNG
    // ---------------------------
    if (url.startsWith("/api/orders/history/") && method === "GET") {
        const userId = url.replace("/api/orders/history/", "");
        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        const userOrders = orders.filter(o => o.userId === userId);
        return userOrders;
    }

    // ---------------------------
    // THUÊ SÁCH
    // ---------------------------
    if (url === "/api/rent/create" && method === "POST") {
        if (!body.userId || !body.bookId) {
            return { success: false, message: "Dữ liệu không hợp lệ" };
        }

        let rentals = JSON.parse(localStorage.getItem("rentals") || "[]");

        const newRental = {
            id: "RENT" + Date.now(),
            userId: body.userId,
            bookId: body.bookId,
            days: body.days || 7,
            rentDate: new Date().toISOString(),
            returnDate: null,
            actualReturnDate: null,
            status: "active"
        };

        rentals.push(newRental);
        localStorage.setItem("rentals", JSON.stringify(rentals));

        return {
            success: true,
            message: "Thuê sách thành công",
            rentalId: newRental.id
        };
    }

    // ---------------------------
    // DANH SÁCH SÁCH ĐANG THUÊ
    // ---------------------------
    if (url.startsWith("/api/rent/list/") && method === "GET") {
        const userId = url.replace("/api/rent/list/", "");
        const rentals = JSON.parse(localStorage.getItem("rentals") || "[]");
        const userRentals = rentals.filter(r => r.userId === userId && r.status === "active");
        return userRentals;
    }
}

// ============================================
// SAMPLE PRODUCTS DATA
// ============================================
const sampleProducts = [
    {id: 'S01', name: 'Tư duy nhanh và chậm', price: 150000, category: 'book', image: 'assets/abc.png', description: 'Cuốn sách giúp cải thiện tư duy logic'},
    {id: 'S02', name: '21 bài học cho thế kỷ 21', price: 180000, category: 'book', image: 'assets/abc.png', description: 'Giải thích các nguyên lý kinh tế hiện đại'},
    {id: 'S03', name: 'Lược sử thời gian', price: 160000, category: 'book', image: 'assets/abc.png', description: 'Khám phá những bí ẩn của vũ trụ'},
    {id: 'S04', name: 'Đắc nhân tâm', price: 130000, category: 'book', image: 'assets/abc.png', description: 'Hướng dẫn kỹ năng giao tiếp'},
    {id: 'S05', name: 'Think Again', price: 175000, category: 'book', image: 'assets/abc.png', description: 'Cách thay đổi suy nghĩ'},
    {id: 'S06', name: 'Thói quen nguyên tử', price: 25000, category: 'rent', image: 'assets/abc.png', description: 'Sức mạnh của thói quen nhỏ'},
    {id: 'S07', name: 'Tôi thấy hoa vàng trên cỏ xanh', price: 20000, category: 'rent', image: 'assets/abc.png', description: 'Tiểu thuyết kinh điển'},
    {id: 'S08', name: 'Tuổi thơ dữ dội', price: 18000, category: 'rent', image: 'assets/abc.png', description: 'Hồi ức tuổi thơ'},
    {id: 'SP01', name: 'Giấy A4 Double A', price: 65000, category: 'vpp', image: 'assets/abc.png', description: 'Giấy in chất lượng cao'},
    {id: 'SP02', name: 'Bút bi Thiên Long', price: 3500, category: 'vpp', image: 'assets/abc.png', description: 'Bút bi xanh'},
];

// ============================================
// HÀM GỌI API SẢN PHẨM
// ============================================
async function getProducts() {
    return await apiRequest("GET", "/api/products");
}

async function getProductById(id) {
    return await apiRequest("GET", `/api/products/${id}`);
}
