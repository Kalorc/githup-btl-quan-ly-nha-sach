document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirm = document.getElementById("confirmPassword").value.trim();

        if (password !== confirm) {
            alert("Mật khẩu không trùng khớp!");
            return;
        }

        if (password.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        try {
            // Gọi API (fake hoặc real tùy USE_FAKE_API)
            const data = await apiRequest("POST", "/api/auth/register", {
                fullName,
                email,
                password
            });

            if (!data.success) {
                alert(data.message || "Đăng ký thất bại!");
                return;
            }

            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            window.location.href = "login.html";
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            alert("Lỗi khi kết nối server!");
        }
    });
});
