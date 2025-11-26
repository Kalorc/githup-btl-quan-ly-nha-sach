// ============================================
// RENDER PRODUCT LIST (product.html)
// ============================================
document.addEventListener("DOMContentLoaded", async () => {
    if (document.getElementById("productGrid")) {
        await loadAndRenderProducts();
        initFilterBar();
    }

    if (document.getElementById("productDetail")) {
        await loadProductDetail();
    }
});

// Load dữ liệu từ API và render
async function loadAndRenderProducts() {
    try {
        const data = await getProducts();
        
        // Nếu API trả về array trực tiếp
        const products = Array.isArray(data) ? data : data.data || [];
        
        renderProducts(products);
        
        // Lưu products vào window để dùng ở filter
        window.allProducts = products;
    } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        document.getElementById("productGrid").innerHTML = 
            "<p>Không thể tải sản phẩm. Vui lòng kiểm tra backend.</p>";
    }
}


// Hiển thị danh sách sản phẩm
function renderProducts(list) {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";

    if (list.length === 0) {
        grid.innerHTML = "<p>Không tìm thấy sản phẩm nào.</p>";
        return;
    }

    list.forEach(p => {
        grid.innerHTML += `
            <div class="product-card" onclick="openDetail('${p.id}')">
                <img src="${p.image}" alt="${p.name}">
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p>${p.price.toLocaleString()}đ</p>
                </div>
            </div>
        `;
    });
}


// Lọc và tìm kiếm
function initFilterBar() {
    const categoryFilter = document.getElementById("categoryFilter");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    function updateFilter() {
        let list = window.allProducts || [];

        const category = categoryFilter.value;
        const keyword = searchInput.value.toLowerCase().trim();

        if (category !== "all") {
            list = list.filter(p => p.category === category);
        }

        if (keyword !== "") {
            list = list.filter(p =>
                p.title.toLowerCase().includes(keyword) ||
                (p.description && p.description.toLowerCase().includes(keyword))
            );
        }

        renderProducts(list);
    }

    categoryFilter.addEventListener("change", updateFilter);
    searchInput.addEventListener("input", updateFilter);
    searchBtn.addEventListener("click", updateFilter);
}


// ============================================
// CHUYỂN SANG TRANG DETAIL
// ============================================
function openDetail(id) {
    window.location.href = `product_detail.html?id=${id}`;
}


// ============================================
// DETAIL PAGE (product_detail.html)
// ============================================
async function loadProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    try {
        const product = await getProductById(id);
        
        if (!product) {
            document.body.innerHTML = "<p>Sản phẩm không tìm thấy</p>";
            return;
        }

        // Render UI
        document.getElementById("productImage").src = product.image || "assets/abc.png";
        document.getElementById("productTitle").innerText = product.name || product.title;
        document.getElementById("productPrice").innerText = product.price.toLocaleString() + "đ";
        document.getElementById("productCategory").innerText = (product.category || "unknown").toUpperCase();
        document.getElementById("productDescription").innerText = product.description || "Không có mô tả";

        // Gắn sự kiện
        document.getElementById("addToCartBtn").onclick = () => addToCart(product);
        document.getElementById("rentBookBtn").onclick = () => rentBook(product);
    } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
        document.body.innerHTML = "<p>Lỗi khi tải sản phẩm</p>";
    }
}


// ============================================
// GIỎ HÀNG (localStorage)
// ============================================
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    cart.push({
        id: product.id,
        name: product.name || product.title,
        price: product.price,
        qty: 1,
        image: product.image
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Đã thêm vào giỏ hàng!");
}


// ============================================
// THUÊ SÁCH (localStorage)
// ============================================
function rentBook(product) {
    let renting = JSON.parse(localStorage.getItem("renting") || "[]");

    renting.push({
        id: product.id,
        name: product.name || product.title,
        price: product.price,
        days: 7,
        image: product.image
    });

    localStorage.setItem("renting", JSON.stringify(renting));
    alert("Đã thêm vào danh sách thuê!");
}
