CREATE TABLE `galleryCategories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`icon` varchar(100),
	`order` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `galleryCategories_id` PRIMARY KEY(`id`),
	CONSTRAINT `galleryCategories_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `promotions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`description` text,
	`discountPercentage` int NOT NULL,
	`galleryItemId` int,
	`validFrom` timestamp,
	`validUntil` timestamp,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `promotions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `galleryItems` ADD `category` varchar(100);--> statement-breakpoint
ALTER TABLE `galleryItems` ADD `isHighlighted` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `galleryItems` ADD `highlightOrder` int;