CREATE TABLE IF NOT EXISTS posts (
	id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	content TEXT,
	created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO
	posts (title, content)
VALUES
	(
		'First Post',
		'This is the content of the first post.'
	),
	(
		'Second Post',
		'This is the content of the second post.'
	);