CREATE TABLE IF NOT EXISTS linked_channels (
    id             bigint PRIMARY KEY,
    linked_to      bigint NOT NULL,
    mirror_webhook bigint NOT NULL
);
