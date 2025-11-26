DROP DATABASE IF EXISTS QuanLyCuaHangSach;
CREATE DATABASE QuanLyCuaHangSach CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE QuanLyCuaHangSach;

-- Bảng sản phẩm (dùng chung cho sách, thuê sách, văn phòng phẩm)
CREATE TABLE products (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image VARCHAR(255),
    description TEXT,
    quantity_available INT DEFAULT 0,  -- Stock tracking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng người dùng
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,  -- UNIQUE constraint
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    address VARCHAR(255),
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng đơn hàng
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    created_at DATE,
    total DECIMAL(12,2),
    status VARCHAR(50) DEFAULT 'pending',  -- pending, approved, completed, canceled
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng chi tiết đơn hàng
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id VARCHAR(20) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL,  -- Snapshot giá tại thời điểm mua
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_order_product (order_id, product_id)  -- Prevent duplicate items
);

-- Bảng thuê sách
CREATE TABLE rentals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id VARCHAR(20) NOT NULL,
    rent_date DATE NOT NULL,
    return_date DATE NOT NULL,
    actual_return_date DATE,  -- NULL = chưa trả
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    CHECK (return_date > rent_date),  -- return_date phải > rent_date
    UNIQUE KEY unique_active_rental (user_id, product_id) GENERATED ALWAYS AS (if(actual_return_date IS NULL, 1, NULL))  -- Prevent duplicate active rentals
);

-- CREATE INDEX
CREATE INDEX idx_user_orders ON orders(user_id);
CREATE INDEX idx_order_items ON order_items(order_id);
CREATE INDEX idx_user_rentals ON rentals(user_id);
CREATE INDEX idx_rental_status ON rentals(actual_return_date);

-- INSERT DỮ LIỆU SAMPLE
INSERT INTO products (id, name, price, category, image, description, quantity_available) VALUES
-- Sách bán
('S01', 'Tư duy nhanh và chậm', 150000, 'book', 'assets/abc.png', 'Cuốn sách giúp cải thiện tư duy logic và phản biện', 10),
('S02', '21 bài học cho thế kỷ 21', 180000, 'book', 'assets/abc.png', 'Giải thích các nguyên lý kinh tế hiện đại', 8),
('S03', 'Lược sử thời gian', 160000, 'book', 'assets/abc.png', 'Khám phá những bí ẩn của vũ trụ', 5),
('S04', 'Đắc nhân tâm', 130000, 'book', 'assets/abc.png', 'Hướng dẫn kỹ năng giao tiếp hiệu quả', 12),
('S05', 'Think Again', 175000, 'book', 'assets/abc.png', 'Cách thay đổi suy nghĩ và cải thiện bản thân', 7),

-- Sách thuê
('S06', 'Thói quen nguyên tử', 25000, 'rent', 'assets/abc.png', 'Khám phá sức mạnh của thói quen nhỏ', 3),
('S07', 'Tôi thấy hoa vàng trên cỏ xanh', 20000, 'rent', 'assets/abc.png', 'Tiểu thuyết kinh điển của văn học Việt', 2),
('S08', 'Tuổi thơ dữ dội', 18000, 'rent', 'assets/abc.png', 'Hồi ức tuổi thơ đầy xúc động', 4),
('S09', 'Kafka bên bờ biển', 22000, 'rent', 'assets/abc.png', 'Tiểu thuyết hiện đại về tìm kiếm cuộc sống', 2),
('S10', 'Tư tưởng Phật học', 20000, 'rent', 'assets/abc.png', 'Triết lý và đạo lý sống', 3),

-- Văn phòng phẩm
('SP01', 'Giấy A4 Double A 70gsm', 65000, 'vpp', 'assets/abc.png', 'Giấy in văn phòng chất lượng cao', 50),
('SP02', 'Bút bi Thiên Long 0.5mm', 3500, 'vpp', 'assets/abc.png', 'Bút bi xanh viết mượt', 100),
('SP03', 'Sổ tay lò xo A5', 25000, 'vpp', 'assets/abc.png', 'Sổ tay ghi chép tiện lợi', 20),
('SP04', 'Băng keo trong', 12000, 'vpp', 'assets/abc.png', 'Băng keo trong 5cm x 50m', 15),
('SP05', 'Bộ màu sáp 12 màu', 35000, 'vpp', 'assets/abc.png', 'Bộ màu sáp vẽ đẹp', 10),
('SP06', 'Tập học sinh 100 trang', 10000, 'vpp', 'assets/abc.png', 'Tập học sinh 100 trang giấy đẹp', 30),
('SP07', 'Bút chì gỗ 2B', 5000, 'vpp', 'assets/abc.png', 'Bút chì gỗ độ đen 2B', 50),
('SP08', 'Ghim kẹp bướm', 15000, 'vpp', 'assets/abc.png', 'Ghim kẹp bướm 50mm', 25),
('SP09', 'Giấy note vàng 3x3', 8000, 'vpp', 'assets/abc.png', 'Giấy note dính 100 tờ', 40),
('SP10', 'Thước kẻ 20cm', 6500, 'vpp', 'assets/abc.png', 'Thước nhựa 20cm trong suốt', 35);

INSERT INTO users (id, full_name, email, password, role) VALUES
(1, 'Admin User', 'admin@example.com', '$2a$10$X.H.qWaWJhO7d5dDYvR.d.5Lw5gW5G9nF0KZ5KH4H5ZQH3O2K5K6', 'ADMIN'),
(2, 'Test User', 'test@example.com', '$2a$10$X.H.qWaWJhO7d5dDYvR.d.5Lw5gW5G9nF0KZ5KH4H5ZQH3O2K5K6', 'USER');
