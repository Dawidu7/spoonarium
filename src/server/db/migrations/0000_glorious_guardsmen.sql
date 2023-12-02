CREATE TABLE `authors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `authors_id` PRIMARY KEY(`id`),
	CONSTRAINT `authors_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `book_authors` (
	`author_id` int NOT NULL,
	`book_id` int NOT NULL,
	CONSTRAINT `book_authors_author_id_book_id_pk` PRIMARY KEY(`author_id`,`book_id`)
);
--> statement-breakpoint
CREATE TABLE `book_genres` (
	`book_id` int NOT NULL,
	`genre_id` int NOT NULL,
	CONSTRAINT `book_genres_book_id_genre_id_pk` PRIMARY KEY(`book_id`,`genre_id`)
);
--> statement-breakpoint
CREATE TABLE `books` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`isbn` varchar(13) NOT NULL,
	`year` int NOT NULL,
	`copies` int NOT NULL,
	`cover_url` varchar(255),
	`blurb` text,
	CONSTRAINT `books_id` PRIMARY KEY(`id`),
	CONSTRAINT `books_title_unique` UNIQUE(`title`),
	CONSTRAINT `books_isbn_unique` UNIQUE(`isbn`)
);
--> statement-breakpoint
CREATE TABLE `genres` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `genres_id` PRIMARY KEY(`id`),
	CONSTRAINT `genres_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `keys` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(15) NOT NULL,
	`hashed_password` varchar(255),
	CONSTRAINT `keys_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` varchar(128) NOT NULL,
	`user_id` varchar(15) NOT NULL,
	`active_expires` bigint NOT NULL,
	`idle_expires` bigint NOT NULL,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`checkout_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`due_date` datetime NOT NULL,
	`return_date` datetime,
	`book_id` int NOT NULL,
	`user_id` varchar(15) NOT NULL,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(15) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(15),
	`first_name` varchar(50) NOT NULL,
	`last_name` varchar(50) NOT NULL,
	`is_staff` boolean NOT NULL DEFAULT false,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_phone_unique` UNIQUE(`phone`),
	CONSTRAINT `users_first_name_last_name_unique` UNIQUE(`first_name`,`last_name`)
);
--> statement-breakpoint
ALTER TABLE `book_authors` ADD CONSTRAINT `book_authors_author_id_authors_id_fk` FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `book_authors` ADD CONSTRAINT `book_authors_book_id_books_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `book_genres` ADD CONSTRAINT `book_genres_book_id_books_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `book_genres` ADD CONSTRAINT `book_genres_genre_id_genres_id_fk` FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `keys` ADD CONSTRAINT `keys_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_book_id_books_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;