INSERT INTO `user` (`id`, `email`, `name`, `last_name`, `age`, `password`, `role`, `registration_date`) VALUES
(56, 'j@gamingrooms.fr', 'Julie', 'Bened', 24, 'demo-password-not-hashed', 'super_admin', NOW()),
(57, 'a@gamingrooms.fr', 'Antoine', 'Milo', 26, 'demo-password-not-hashed', 'admin', NOW()),
(58, 'b@gamingrooms.fr', 'Benjamin', 'Dupuis', 24, 'demo-password-not-hashed', 'user', NOW())
ON DUPLICATE KEY UPDATE
  `email` = VALUES(`email`),
  `name` = VALUES(`name`),
  `last_name` = VALUES(`last_name`),
  `role` = VALUES(`role`);
