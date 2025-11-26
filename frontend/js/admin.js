// ===============================
// DỮ LIỆU MẪU (TẠM CHỈ DÙNG CHO FRONTEND)
// SAU NÀY SẼ THAY BẰNG API SPRING BOOT
// ===============================

// ---------- PRODUCTS ----------
let sampleProducts = JSON.parse(localStorage.getItem("adminProducts")) || [
    {
        id: 1,
        name: "Sách tư duy A",
        price: 120000,
        category: "Sách bán",
        image: "../assets/abc.png"
    },
    {
        id: 2,
        name: "Sách thuê: Java",
        price: 25000,
        category: "Thuê sách",
        image: "../assets/abc.png"
    }
];

// ---------- ORDERS ----------
let sampleOrders = [
    {
        code: "DH001",
        user: "Nguyễn Văn A",
        total: 250000,
        date: "2025-01-20",
        status: "pending", // chờ duyệt
        items: [
            { title: "Sách tư duy A", qty: 1, price: 120000 },
            { title: "Vở 200 trang", qty: 2, price: 30000 }
        ]
    },
    {
        code: "DH002",
        user: "Trần Thị B",
        total: 98000,
        date: "2025-01-18",
        status: "completed", // hoàn thành
        items: [
            { title: "Bút bi Thiên Long", qty: 5, price: 5000 }
        ]
    },
    {
        code: "DH003",
        user: "Lê Văn C",
        total: 150000,
        date: "2025-01-19",
        status: "approved", // đã duyệt
        items: [
            { title: "Sách kỹ năng sống C", qty: 1, price: 98000 },
            { title: "Bút bi Thiên Long", qty: 2, price: 5000 }
        ]
    }
];

// ---------- USERS ----------
let sampleUsers = [
    { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com", role: "User",  created: "2025-01-10", status: "Hoạt động" },
    { id: 2, name: "Admin",       email: "admin@gmail.com", role: "Admin", created: "2025-01-01", status: "Hoạt động" },
    { id: 3, name: "Trần Thị B",  email: "b@gmail.com", role: "User",  created: "2025-01-05", status: "Khóa" }
];

// ---------- RENTAL ----------
let sampleRentals = [
    {
        id: 1,
        user: "Nguyễn Văn A",
        book: "Sách thuê: Lập trình Java",
        rentDate: "2025-01-10",
        dueDate: "2025-01-17",
        status: "Đang thuê"
    },
    {
        id: 2,
        user: "Trần Thị B",
        book: "Sách thuê: Thiền & Tĩnh lặng",
        rentDate: "2025-01-09",
        dueDate: "2025-01-16",
        status: "Đã trả"
    }
];


// ===============================
// AUTO NHẬN DIỆN TRANG & LOAD
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    if (path.includes("dashboard.html")) loadDashboard();
    if (path.includes("products.html"))  initProductsPage();
    if (path.includes("orders.html"))    initOrdersPage();
    if (path.includes("users.html"))     loadUsers();
    if (path.includes("rental.html"))    loadRental();
});


// ===============================
// DASHBOARD
// ===============================
function loadDashboard() {
    const totalProductsEl = document.getElementById("totalProducts");
    const totalOrdersEl   = document.getElementById("totalOrders");
    const totalRentingEl  = document.getElementById("totalRenting");
    const todayRevenueEl  = document.getElementById("todayRevenue");

    if (!totalProductsEl) return;

    totalProductsEl.innerText = sampleProducts.length;
    totalOrdersEl.innerText   = sampleOrders.length;
    totalRentingEl.innerText  = sampleRentals.filter(r => r.status === "Đang thuê").length;

    // Tạm: doanh thu hôm nay fake
    todayRevenueEl.innerText  = "350.000đ";
}


// ===============================
// PRODUCTS PAGE
// ===============================
let currentEditingIndex = -1;

function initProductsPage() {
    loadProducts();

    const btn = document.getElementById("addProductBtn");
    if (btn) btn.addEventListener("click", openAddProductModal);
}

function loadProducts() {
    const body = document.getElementById("productTableBody");
    if (!body) return;

    body.innerHTML = "";

    sampleProducts.forEach((p, index) => {
        body.innerHTML += `
            <tr>
                <td><img src="${p.image}" style="width:50px;height:60px;object-fit:cover;"></td>
                <td>${p.name}</td>
                <td>${p.price.toLocaleString()}đ</td>
                <td>${p.category}</td>
                <td>
                    <button onclick="editProduct(${index})">✏ Sửa</button>
                    <button onclick="deleteProduct(${index})">🗑 Xóa</button>
                </td>
            </tr>
        `;
    });
}

function openAddProductModal() {
    currentEditingIndex = -1;
    document.getElementById("modalTitle").innerText = "Thêm sản phẩm";
    document.getElementById("pName").value = "";
    document.getElementById("pPrice").value = "";
    document.getElementById("pCategory").value = "Sách bán";
    document.getElementById("pImg").value = "../assets/abc.png";

    document.getElementById("productModal").style.display = "flex";
}

function editProduct(index) {
    currentEditingIndex = index;
    const p = sampleProducts[index];

    document.getElementById("modalTitle").innerText = "Sửa sản phẩm";
    document.getElementById("pName").value = p.name;
    document.getElementById("pPrice").value = p.price;
    document.getElementById("pCategory").value = p.category;
    document.getElementById("pImg").value = p.image;

    document.getElementById("productModal").style.display = "flex";
}

function saveProduct() {
    const name     = document.getElementById("pName").value.trim();
    const price    = Number(document.getElementById("pPrice").value);
    const category = document.getElementById("pCategory").value;
    const image    = document.getElementById("pImg").value.trim() || "../assets/abc.png";

    if (!name || !price) {
        alert("Vui lòng nhập đầy đủ tên và giá.");
        return;
    }

    if (currentEditingIndex === -1) {
        // Thêm mới
        sampleProducts.push({
            id: Date.now(),
            name,
            price,
            category,
            image
        });
    } else {
        // Cập nhật
        sampleProducts[currentEditingIndex] = {
            ...sampleProducts[currentEditingIndex],
            name,
            price,
            category,
            image
        };
    }

    // Tạm lưu vào localStorage để refresh trang vẫn còn
    localStorage.setItem("adminProducts", JSON.stringify(sampleProducts));

    closeModal();
    loadProducts();
}

function deleteProduct(index) {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    sampleProducts.splice(index, 1);
    localStorage.setItem("adminProducts", JSON.stringify(sampleProducts));
    loadProducts();
}

function closeModal() {
    const modal = document.getElementById("productModal");
    if (modal) modal.style.display = "none";
}


// ===============================
// ORDERS PAGE
// ===============================
function initOrdersPage() {
    const filter = document.getElementById("orderFilter");
    if (filter) {
        filter.addEventListener("change", loadOrders);
    }
    loadOrders();
}

function loadOrders() {
    const body   = document.getElementById("orderTableBody");
    const filter = document.getElementById("orderFilter");
    if (!body || !filter) return;

    const statusFilter = filter.value; // all / pending / approved / completed / canceled
    body.innerHTML = "";

    let list = sampleOrders;
    if (statusFilter !== "all") {
        list = list.filter(o => o.status === statusFilter);
    }

    list.forEach(o => {
        body.innerHTML += `
            <tr>
                <td>${o.code}</td>
                <td>${o.user}</td>
                <td>${o.total.toLocaleString()}đ</td>
                <td>${o.date}</td>
                <td>${mapOrderStatus(o.status)}</td>
                <td>
                    <button onclick="openOrderModal('${o.code}')">👁 Xem</button>
                </td>
            </tr>
        `;
    });
}

function mapOrderStatus(status) {
    switch (status) {
        case "pending":   return "Chờ duyệt";
        case "approved":  return "Đã duyệt";
        case "completed": return "Hoàn thành";
        case "canceled":  return "Đã hủy";
        default:          return status;
    }
}

function openOrderModal(code) {
    const order = sampleOrders.find(o => o.code === code);
    if (!order) return;

    document.getElementById("modalOrderCode").innerText = `Chi tiết đơn hàng ${code}`;

    const htmlItems = order.items.map(i => `
        <p>- ${i.title}: ${i.qty} x ${i.price.toLocaleString()}đ</p>
    `).join("");

    document.getElementById("modalContent").innerHTML = `
        <p><strong>Người mua:</strong> ${order.user}</p>
        <p><strong>Tổng tiền:</strong> ${order.total.toLocaleString()}đ</p>
        <p><strong>Ngày tạo:</strong> ${order.date}</p>
        <p><strong>Trạng thái:</strong> ${mapOrderStatus(order.status)}</p>
        <hr>
        <p><strong>Sản phẩm:</strong></p>
        ${htmlItems}
    `;

    document.getElementById("orderModal").style.display = "flex";
}

function closeOrderModal() {
    document.getElementById("orderModal").style.display = "none";
}


// ===============================
// USERS PAGE
// ===============================
function loadUsers() {
    const body = document.getElementById("userTableBody");
    if (!body) return;

    body.innerHTML = "";

    sampleUsers.forEach(u => {
        body.innerHTML += `
            <tr>
                <td>${u.id}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.role}</td>
                <td>${u.created}</td>
                <td>${u.status}</td>
                <td>
                    <button onclick="openUserModal(${u.id})">👁 Xem</button>
                </td>
            </tr>
        `;
    });
}

function openUserModal(id) {
    const u = sampleUsers.find(x => x.id === id);
    if (!u) return;

    document.getElementById("userModalTitle").innerText = "Thông tin người dùng";
    document.getElementById("userModalContent").innerHTML = `
        <p><strong>Tên:</strong> ${u.name}</p>
        <p><strong>Email:</strong> ${u.email}</p>
        <p><strong>Quyền:</strong> ${u.role}</p>
        <p><strong>Ngày tạo:</strong> ${u.created}</p>
        <p><strong>Trạng thái:</strong> ${u.status}</p>
    `;

    document.getElementById("userModal").style.display = "flex";
}

function closeUserModal() {
    document.getElementById("userModal").style.display = "none";
}


// ===============================
// RENTAL PAGE
// ===============================
function loadRental() {
    const body = document.getElementById("rentalTableBody");
    if (!body) return;

    body.innerHTML = "";

    sampleRentals.forEach(r => {
        body.innerHTML += `
            <tr>
                <td>${r.user}</td>
                <td>${r.book}</td>
                <td>${r.rentDate}</td>
                <td>${r.dueDate}</td>
                <td>${r.status}</td>
                <td><button onclick="openRentalModal(${r.id})">👁 Xem</button></td>
            </tr>
        `;
    });
}

function openRentalModal(id) {
    const r = sampleRentals.find(x => x.id === id);
    if (!r) return;

    document.getElementById("rentalModalTitle").innerText = "Thông tin thuê";

    document.getElementById("rentalModalContent").innerHTML = `
        <p><strong>Người thuê:</strong> ${r.user}</p>
        <p><strong>Sách:</strong> ${r.book}</p>
        <p><strong>Ngày thuê:</strong> ${r.rentDate}</p>
        <p><strong>Ngày phải trả:</strong> ${r.dueDate}</p>
        <p><strong>Trạng thái:</strong> ${r.status}</p>
    `;

    document.getElementById("rentalModal").style.display = "flex";
}

function closeRentalModal() {
    document.getElementById("rentalModal").style.display = "none";
}
