INSERT INTO user (username, name, email, password, phone, role, isActive) VALUES
('admin', 'Admin Minda', 'admin@example.com', '$2b$10$Nh03G7n3UIsuQvUEbLALiOD4Y3p0vMgFUpUyM8eEwX4F9bU6vv3zi', '123-456-7890', 'admin', 1),
('staff1', 'John Staff', 'john.staff@example.com', '$2b$10$Nh03G7n3UIsuQvUEbLALiOD4Y3p0vMgFUpUyM8eEwX4F9bU6vv3zi', '0917-111-1111', 'staff', 1),
('staff2', 'Jane Worker', 'jane.staff@example.com', '$2b$10$Nh03G7n3UIsuQvUEbLALiOD4Y3p0vMgFUpUyM8eEwX4F9bU6vv3zi', '0917-222-2222', 'staff', 1),
('staff3', 'Liam Clerk', 'liam.staff@example.com', '$2b$10$Nh03G7n3UIsuQvUEbLALiOD4Y3p0vMgFUpUyM8eEwX4F9bU6vv3zi', '0917-333-3333', 'staff', 1),
('customer1', 'Alice Customer', 'alice@example.com', '$2b$10$Nh03G7n3UIsuQvUEbLALiOD4Y3p0vMgFUpUyM8eEwX4F9bU6vv3zi', '0917-444-4444', 'customer', 1),
('customer2', 'Bob Buyer', 'bob@example.com', '$2b$10$Nh03G7n3UIsuQvUEbLALiOD4Y3p0vMgFUpUyM8eEwX4F9bU6vv3zi', '0917-555-5555', 'customer', 1),
('customer3', 'Charlie Guest', 'charlie@example.com', '$2b$10$Nh03G7n3UIsuQvUEbLALiOD4Y3p0vMgFUpUyM8eEwX4F9bU6vv3zi', '0917-666-6666', 'customer', 1),
('customer4', 'Dana Shopper', 'dana@example.com', '$2b$10$Nh03G7n3UIsuQvUEbLALiOD4Y3p0vMgFUpUyM8eEwX4F9bU6vv3zi', '0917-777-7777', 'customer', 1),
('customer5', 'Ethan User', 'ethan@example.com', '$2b$10$Nh03G7n3UIsuQvUEbLALiOD4Y3p0vMgFUpUyM8eEwX4F9bU6vv3zi', '0917-888-8888', 'customer', 1),
('customer6', 'Fiona Visitor', 'fiona@example.com', '$2b$10$Nh03G7n3UIsuQvUEbLALiOD4Y3p0vMgFUpUyM8eEwX4F9bU6vv3zi', '0917-999-9999', 'customer', 1);


INSERT INTO room (name, capacity, isAvailable, isActive, price) VALUES
('Room A', 2, 1, 1, 500.00),
('Room B', 4, 1, 1, 600.00),
('Room C', 6, 1, 1, 700.00),
('Room D', 3, 1, 1, 800.00),
('Room E', 5, 1, 1, 900.00),
('Room F', 10, 1, 1, 1000.00),
('Room G', 8, 1, 1, 1100.00),
('Room H', 12, 1, 1, 1200.00),
('Room I', 1, 1, 1, 1300.00),
('Room J', 2, 1, 1, 1400.00);


INSERT INTO payment (amount, method, paidAt) VALUES
(100.00, 'credit_card', NOW()),
(150.50, 'paypal', NOW()),
(200.00, 'cash', NOW()),
(75.25, 'debit_card', NOW()),
(300.00, 'credit_card', NOW()),
(120.75, 'paypal', NOW()),
(250.00, 'cash', NOW()),
(180.00, 'credit_card', NOW()),
(90.00, 'cash', NOW()),
(60.00, 'debit_card', NOW());


INSERT INTO reservation (createdAt, startTime, endTime, roomId, userId, paymentId, isActive, status) VALUES
(NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 2 HOUR), 1, 1, 1, 1, 'confirmed'),
(NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 3 HOUR), 2, 2, 2, 1, 'confirmed'),
(NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR), 3, 3, 3, 1, 'cancelled'),
(NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 4 HOUR), 4, 4, 4, 1, 'pending'),
(NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 2 HOUR), 5, 5, 5, 1, 'confirmed'),
(NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 5 HOUR), 6, 6, 6, 1, 'confirmed'),
(NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR), 7, 7, 7, 1, 'cancelled'),
(NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 3 HOUR), 8, 8, 8, 1, 'confirmed'),
(NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 2 HOUR), 9, 9, 9, 1, 'pending'),
(NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR), 10, 10, 10, 1, 'confirmed');



INSERT INTO product (name, sku, description, price, quantity, is_active) VALUES
-- Beverages
('San Miguel Beer', 'SMB-001', 'Bottle of San Miguel Beer 330ml', 85.00, 200, 1),
('Red Horse Beer', 'RHB-002', 'Bottle of Red Horse Beer 500ml', 95.00, 150, 1),
('Coca Cola', 'CC-003', 'Coca Cola 355ml can', 45.00, 300, 1),
('Sprite', 'SP-004', 'Sprite 355ml can', 45.00, 250, 1),
('Iced Tea', 'IT-005', 'Nestea Iced Tea 500ml', 50.00, 180, 1),
('Bottled Water', 'BW-006', 'Summit Water 500ml', 25.00, 400, 1),
('Royal Tru-Orange', 'RTO-007', 'Royal Tru-Orange 355ml can', 45.00, 200, 1),
('Emperador Brandy', 'EB-008', 'Emperador Light Brandy 700ml', 450.00, 50, 1),
('Tanduay Rhum', 'TR-009', 'Tanduay White Rhum 700ml', 380.00, 40, 1),
('Soju', 'SJ-010', 'Korean Soju 360ml', 120.00, 80, 1),

-- Snacks and Food
('Chicharon', 'CH-011', 'Crispy pork chicharon', 65.00, 100, 1),
('Peanuts', 'PN-012', 'Salted peanuts 100g', 35.00, 150, 1),
('Sisig', 'SG-013', 'Pork sisig with egg', 185.00, 50, 1),
('Chicken Wings', 'CW-014', '6 pieces spicy chicken wings', 165.00, 80, 1),
('Lumpia Shanghai', 'LS-015', '10 pieces fried lumpia', 125.00, 60, 1),
('French Fries', 'FF-016', 'Crispy french fries with ketchup', 95.00, 120, 1),
('Cheese Sticks', 'CS-017', '8 pieces mozzarella sticks', 145.00, 70, 1),
('Nachos', 'NC-018', 'Nachos with cheese dip', 115.00, 90, 1),
('Popcorn', 'PC-019', 'Caramel popcorn bucket', 75.00, 200, 1),
('Ice Cream', 'IC-020', 'Vanilla ice cream cup', 55.00, 100, 1),

-- KTV Extras
('Song Credits', 'SC-021', 'Additional 50 song credits', 100.00, 999, 1),
('Extra Hour', 'EH-022', 'Room extension for 1 hour', 200.00, 999, 1),
('Microphone', 'MC-023', 'Wireless microphone rental', 150.00, 20, 1),
('Tambourine', 'TB-024', 'Tambourine rental', 50.00, 15, 1),
('Party Package', 'PP-025', 'Birthday party decoration set', 350.00, 25, 1);

-- Insert sample orders for KTV customers
INSERT INTO `order` (user_id, product_id, quantity, unit_price, total_price, status, notes) VALUES
-- Admin test orders
(1, 1, 6, 85.00, 510.00, 'completed', 'Staff meeting celebration'),
(1, 13, 2, 185.00, 370.00, 'completed', 'Food for office event'),

-- Staff orders (employee purchases)
(2, 3, 2, 45.00, 90.00, 'completed', 'Break time drinks'),
(2, 12, 1, 35.00, 35.00, 'completed', 'Snack during shift'),
(3, 6, 3, 25.00, 75.00, 'completed', 'Water for customers'),
(3, 19, 1, 75.00, 75.00, 'pending', 'For room cleaning'),
(4, 4, 4, 45.00, 180.00, 'completed', 'Drinks for Room B cleanup'),

-- Customer orders during KTV sessions
(5, 1, 12, 85.00, 1020.00, 'completed', 'Room A - Birthday celebration'),
(5, 14, 2, 165.00, 330.00, 'completed', 'Room A - Additional food'),
(5, 21, 1, 100.00, 100.00, 'completed', 'Room A - More songs'),
(6, 2, 8, 95.00, 760.00, 'completed', 'Room B - Company outing'),
(6, 15, 3, 125.00, 375.00, 'completed', 'Room B - Appetizers'),
(6, 22, 2, 200.00, 400.00, 'completed', 'Room B - Extended session'),
(7, 8, 1, 450.00, 450.00, 'cancelled', 'Room C - Changed to beer instead'),
(7, 1, 6, 85.00, 510.00, 'completed', 'Room C - Beer order'),
(7, 16, 2, 95.00, 190.00, 'completed', 'Room C - Fries for group'),
(8, 10, 4, 120.00, 480.00, 'completed', 'Room D - Soju night'),
(8, 18, 2, 115.00, 230.00, 'completed', 'Room D - Nachos sharing'),
(8, 25, 1, 350.00, 350.00, 'pending', 'Room D - Surprise party setup'),
(9, 3, 6, 45.00, 270.00, 'completed', 'Room E - Soft drinks only'),
(9, 17, 3, 145.00, 435.00, 'completed', 'Room E - Cheese sticks'),
(9, 20, 5, 55.00, 275.00, 'completed', 'Room E - Ice cream for kids'),
(10, 9, 2, 380.00, 760.00, 'completed', 'Room F - Tanduay for the boys'),
(10, 11, 4, 65.00, 260.00, 'completed', 'Room F - Chicharon pulutan'),
(10, 23, 2, 150.00, 300.00, 'completed', 'Room F - Extra mics for duet'),

-- Additional customer orders
(5, 4, 8, 45.00, 360.00, 'completed', 'Room G - Sprite mixer'),
(6, 12, 6, 35.00, 210.00, 'completed', 'Room H - Peanuts for drinking'),
(7, 7, 10, 45.00, 450.00, 'pending', 'Room I - Royal for mixing'),
(8, 24, 1, 50.00, 50.00, 'completed', 'Room J - Tambourine fun'),
(9, 6, 12, 25.00, 300.00, 'completed', 'Room A - Water for hydration'),
(10, 21, 2, 100.00, 200.00, 'completed', 'Room B - Extra song credits');