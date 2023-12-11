CREATE TABLE IF NOT EXISTS `persons` (
    `id` VARCHAR(225) NOT NULL,
    `name` VARCHAR(225) NOT NULL,
    `imageUri` VARCHAR(500) NOT NULL,
    `lastSeen` VARCHAR(30),
    `isOnline` BOOLEAN NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `chats` (
    `id` VARCHAR(225) NOT NULL,
    `to` VARCHAR(225) NOT NULL,
    `from` VARCHAR(225) NOT NULL,
    `text` VARCHAR(1000) NOT NULL,
    `date` VARCHAR(30),
    `status` CHAR(8) NOT NULL,
    PRIMARY KEY (`id`)
);