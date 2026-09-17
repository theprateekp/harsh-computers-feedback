CREATE TABLE `feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`customerName` varchar(120),
	`customerContact` varchar(160),
	`rating` int NOT NULL,
	`npsScore` int NOT NULL,
	`serviceType` varchar(80) NOT NULL,
	`comment` text,
	`sentiment` enum('positive','neutral','negative') NOT NULL,
	`tags` text,
	`source` enum('google-qr','direct','landing','counter') NOT NULL DEFAULT 'direct',
	`followUp` int NOT NULL DEFAULT 0,
	`status` enum('new','reviewed','closed') NOT NULL DEFAULT 'new',
	CONSTRAINT `feedback_id` PRIMARY KEY(`id`)
);
