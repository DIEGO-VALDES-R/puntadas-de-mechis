CREATE TABLE `completionNotifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestId` int NOT NULL,
	`customerId` int NOT NULL,
	`message` text NOT NULL,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`deliveryStatus` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	CONSTRAINT `completionNotifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `galleryItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`imageUrl` varchar(500) NOT NULL,
	`price` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `galleryItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `qrCodeTracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestId` int NOT NULL,
	`qrCode` varchar(500) NOT NULL,
	`status` enum('created','in_production','ready','shipped','delivered') NOT NULL DEFAULT 'created',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `qrCodeTracking_id` PRIMARY KEY(`id`),
	CONSTRAINT `qrCodeTracking_qrCode_unique` UNIQUE(`qrCode`)
);
