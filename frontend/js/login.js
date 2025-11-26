document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

        try {
            // Gọi API (fake hoặc real tùy USE_FAKE_API)
            const data = await apiRequest("POST", "/api/auth/login", { email, password });

            if (!data.success) {
                alert(data.message || "Đăng nhập thất bại!");
                return;
            }

            // Lưu token và userId vào localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);

            alert("Đăng nhập thành công!");
            window.location.href = "index.html";
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            alert("Lỗi khi kết nối server!");
        }
    });
});
