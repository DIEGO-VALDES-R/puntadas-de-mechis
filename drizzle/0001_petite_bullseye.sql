CREATE TABLE `amigurumiRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`description` text NOT NULL,
	`referenceImageUrl` varchar(500),
	`packageType` enum('wooden_box','paper_bag','chest_box','glass_dome') NOT NULL,
	`depositAmount` int NOT NULL,
	`totalAmount` int,
	`status` enum('pending','deposit_paid','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
	`paymentId` varchar(100),
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `amigurumiRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `communications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestId` int NOT NULL,
	`customerId` int NOT NULL,
	`senderType` enum('customer','admin') NOT NULL,
	`message` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `communications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`referralCode` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `customers_email_unique` UNIQUE(`email`),
	CONSTRAINT `customers_referralCode_unique` UNIQUE(`referralCode`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestId` int NOT NULL,
	`customerId` int NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'COP',
	`boldTransactionId` varchar(100),
	`status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`paymentMethod` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payments_boldTransactionId_unique` UNIQUE(`boldTransactionId`)
);
