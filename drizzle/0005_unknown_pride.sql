ALTER TABLE `amigurumiRequests` ADD `trackingCode` varchar(6);--> statement-breakpoint
ALTER TABLE `amigurumiRequests` ADD CONSTRAINT `amigurumiRequests_trackingCode_unique` UNIQUE(`trackingCode`);