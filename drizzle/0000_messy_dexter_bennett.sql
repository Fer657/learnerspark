CREATE TABLE `assessment_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`attempt_id` varchar(36) NOT NULL,
	`student_id` int NOT NULL,
	`test_slug` varchar(32) NOT NULL,
	`test_name` varchar(120) NOT NULL,
	`score` int NOT NULL,
	`percentage` int NOT NULL,
	`status` varchar(24) NOT NULL DEFAULT 'completed',
	`created_at` bigint NOT NULL,
	CONSTRAINT `assessment_attempts_id` PRIMARY KEY(`id`),
	CONSTRAINT `assessment_attempts_attempt_id_unique` UNIQUE(`attempt_id`)
);
--> statement-breakpoint
CREATE TABLE `managed_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`test_id` int,
	`prompt` text NOT NULL,
	`question_type` varchar(60) NOT NULL,
	`format_label` varchar(100) NOT NULL,
	`options` text NOT NULL,
	`correct_answer` text NOT NULL,
	`explanation` text NOT NULL,
	`category` varchar(80) NOT NULL,
	`difficulty` varchar(32) NOT NULL,
	`status` varchar(24) NOT NULL DEFAULT 'published',
	`created_at` bigint NOT NULL,
	CONSTRAINT `managed_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `managed_tests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(80) NOT NULL,
	`title` varchar(160) NOT NULL,
	`description` text NOT NULL,
	`duration` int NOT NULL DEFAULT 0,
	`difficulty` varchar(32) NOT NULL DEFAULT 'Mixed',
	`status` varchar(24) NOT NULL DEFAULT 'draft',
	`created_at` bigint NOT NULL,
	`updated_at` bigint NOT NULL,
	CONSTRAINT `managed_tests_id` PRIMARY KEY(`id`),
	CONSTRAINT `managed_tests_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `student_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`token_hash` varchar(64) NOT NULL,
	`created_at` bigint NOT NULL,
	`expires_at` bigint NOT NULL,
	CONSTRAINT `student_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `student_sessions_token_hash_unique` UNIQUE(`token_hash`)
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_code` varchar(32) NOT NULL,
	`email` varchar(320) NOT NULL,
	`mobile` varchar(16) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`full_name` varchar(120) NOT NULL,
	`date_of_birth` varchar(12) NOT NULL,
	`gender` varchar(40) NOT NULL,
	`education_level` varchar(80) NOT NULL,
	`defence_entry` varchar(80) NOT NULL,
	`target_exam` varchar(120),
	`attempt_year` varchar(10),
	`previous_ssb_experience` varchar(80),
	`state` varchar(80) NOT NULL,
	`city` varchar(80) NOT NULL,
	`status` varchar(16) NOT NULL DEFAULT 'Active',
	`consent_at` bigint NOT NULL,
	`created_at` bigint NOT NULL,
	`last_login_at` bigint,
	CONSTRAINT `students_id` PRIMARY KEY(`id`),
	CONSTRAINT `students_student_code_unique` UNIQUE(`student_code`),
	CONSTRAINT `students_email_unique` UNIQUE(`email`),
	CONSTRAINT `students_mobile_unique` UNIQUE(`mobile`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
ALTER TABLE `assessment_attempts` ADD CONSTRAINT `assessment_attempts_student_id_students_id_fk` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `managed_questions` ADD CONSTRAINT `managed_questions_test_id_managed_tests_id_fk` FOREIGN KEY (`test_id`) REFERENCES `managed_tests`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_sessions` ADD CONSTRAINT `student_sessions_student_id_students_id_fk` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE cascade ON UPDATE no action;