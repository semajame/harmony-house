INSERT INTO user (username, email, password, phone, role, isActive) VALUES
('admin', 'admin@example.com', '$2b$10$Nh03G7n3UIsuQvUEbLALiOD4Y3p0vMgFUpUyM8eEwX4F9bU6vv3zi', '123-456-7890', 'admin', 1);

INSERT INTO customer (name, email, phone, isActive) VALUES
('Alice Johnson', 'alice@example.com', '111-111-1111', 1),
('Bob Smith', 'bob@example.com', '222-222-2222', 1),
('Charlie Brown', 'charlie@example.com', '333-333-3333', 1),
('Diana Prince', 'diana@example.com', '444-444-4444', 1),
('Ethan Hunt', 'ethan@example.com', '555-555-5555', 1),
('Fiona Apple', 'fiona@example.com', '666-666-6666', 1),
('George Orwell', 'george@example.com', '777-777-7777', 1),
('Helen Keller', 'helen@example.com', '888-888-8888', 1),
('Ian McKellen', 'ian@example.com', '999-999-9999', 1),
('Julia Roberts', 'julia@example.com', '101-010-1010', 1);


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


INSERT INTO reservation (createdAt, startTime, endTime, roomId, customerId, paymentId, isActive, status) VALUES
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
