INSERT INTO user (username, name, email, password, phone, role, isActive) VALUES
('admin', 'Admin Minda', 'admin@example.com', '$2b$10$Nh03G7n3UIsuQvUEbLALiOD4Y3p0vMgFUpUyM8eEwX4F9bU6vv3zi', '123-456-7890', 'admin', 1),
('staff1', 'John Staff', 'john.staff@example.com', '$2b$10$Nh03G7n3UIsuQvUEbLALiOD4Y3p0vMgFUpUyM8eEwX4F9bU6vv3zi', '0917-111-1111', 'staff', 1),
('staff2', 'Jane Worker', 'jane.staff@example.com', '$2b$10$Nh03G7n3UIsuQvUEbLALiOD4Y3p0vMgFUpUyM8eEwX4F9bU6vv3zi', '0917-222-2222', 'staff', 1),
('customer1', 'Alice Customer', 'alice@example.com', '$2b$10$Nh03G7n3UIsuQvUEbLALiOD4Y3p0vMgFUpUyM8eEwX4F9bU6vv3zi', '0917-444-4444', 'customer', 1),
('customer2', 'Bob Buyer', 'bob@example.com', '$2b$10$Nh03G7n3UIsuQvUEbLALiOD4Y3p0vMgFUpUyM8eEwX4F9bU6vv3zi', '0917-555-5555', 'customer', 1);



INSERT INTO room (id, name, capacity, isAvailable, isActive, price, description, image) VALUES
(1, 'Room no.1', 5, 1, 1, 500.00, 'A stylish room with enhanced decor, amenities and mood lighting.', '/images/rooms/room_1.png'),
(2, 'Room no.2', 5, 1, 1, 500.00, 'A stylish KTV room with basic karaoke equipment, a large screen, mood lighting. Perfect for small gatherings.', '/images/rooms/room_2.png'),
(3, 'Room no.3', 5, 1, 1, 500.00, 'A small KTV room with basic equipment, cozy seating and enhanced amenities. Great for intimate celebrations.', '/images/rooms/room_3.png'),
(4, 'Room no.4', 5, 1, 1, 500.00, 'A compact KTV room with a basic sound system for karaoke and intimate singing sessions.', '/images/rooms/room_4.png');


INSERT INTO payment (amount, method, paidAt) VALUES
(100.00, 'credit_card', NOW()),
(150.50, 'paypal', NOW()),
(200.00, 'cash', NOW()),
(75.25, 'debit_card', NOW()),
(300.00, 'credit_card', NOW());



INSERT INTO reservation (createdAt, startTime, endTime, roomId, userId, paymentId, isActive, status) VALUES
(NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 2 HOUR), 1, 1, 1, 1, 'confirmed'),
(NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 3 HOUR), 2, 2, 2, 1, 'confirmed'),
(NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR), 3, 3, 3, 1, 'cancelled'),
(NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 4 HOUR), 4, 4, 4, 1, 'pending'),
(NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 2 HOUR), 5, 5, 5, 1, 'confirmed');



INSERT INTO product (name, description, price, is_active) VALUES
('San Miguel Beer', 'Bottle of San Miguel Beer 330ml', 85.00, 1),
('Coca Cola', 'Coca Cola 355ml can', 45.00, 1),
('Sisig', 'Pork sisig with egg', 185.00, 1),
('Nachos', 'Nachos with cheese dip', 115.00, 1),
('Extra Hour', 'Room extension for 1 hour', 200.00, 1);



-- Insert sample orders for KTV customers
INSERT INTO `order` (user_id, product_id, quantity, unit_price, total_price, status, notes) VALUES
(1, 1, 6, 85.00, 510.00, 'completed', 'Staff meeting celebration'),
(2, 2, 2, 45.00, 90.00, 'completed', 'Break time drinks'),
(3, 3, 1, 185.00, 185.00, 'completed', 'Lunch for customer'),
(4, 4, 2, 115.00, 230.00, 'completed', 'Shared snack'),
(5, 5, 1, 200.00, 200.00, 'completed', 'Extended session');
