CREATE TABLE `admin_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(100) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`role` varchar(30) NOT NULL DEFAULT 'admin',
	`status` varchar(20) NOT NULL DEFAULT 'active',
	`created_at` bigint NOT NULL,
	`last_login_at` bigint,
	CONSTRAINT `admin_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_accounts_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `admin_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`admin_id` int NOT NULL,
	`token_hash` varchar(64) NOT NULL,
	`expires_at` bigint NOT NULL,
	CONSTRAINT `admin_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_sessions_token_hash_unique` UNIQUE(`token_hash`)
);
--> statement-breakpoint
CREATE TABLE `auth_rate_limits` (
	`key_hash` varchar(64) NOT NULL,
	`failures` int NOT NULL DEFAULT 0,
	`window_start` bigint NOT NULL,
	`blocked_until` bigint NOT NULL DEFAULT 0,
	CONSTRAINT `auth_rate_limits_key_hash` PRIMARY KEY(`key_hash`)
);
--> statement-breakpoint
ALTER TABLE `admin_sessions` ADD CONSTRAINT `admin_sessions_admin_id_admin_accounts_id_fk` FOREIGN KEY (`admin_id`) REFERENCES `admin_accounts`(`id`) ON DELETE cascade ON UPDATE no action;