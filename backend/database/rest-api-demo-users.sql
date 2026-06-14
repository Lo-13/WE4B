INSERT INTO `user` (`id`, `email`, `name`, `last_name`, `age`, `password`, `role`, `registration_date`) VALUES
(56, 'j@gamingrooms.fr', 'Julie', 'Bened', 24, '$2b$10$xMxC0zzB33xMbZI4aX1mdeC.BMf5bvwXHboalSPfhWu6ewOrTh/3a', 'super_admin', NOW()),
(57, 'a@gamingrooms.fr', 'Antoine', 'Milo', 26, '$2b$10$xMxC0zzB33xMbZI4aX1mdeC.BMf5bvwXHboalSPfhWu6ewOrTh/3a', 'admin', NOW()),
(58, 'b@gamingrooms.fr', 'Benjamin', 'Dupuis', 24, '$2b$10$xMxC0zzB33xMbZI4aX1mdeC.BMf5bvwXHboalSPfhWu6ewOrTh/3a', 'user', NOW())
ON DUPLICATE KEY UPDATE
  `email` = VALUES(`email`),
  `name` = VALUES(`name`),
  `last_name` = VALUES(`last_name`),
  `password` = VALUES(`password`),
  `role` = VALUES(`role`);


