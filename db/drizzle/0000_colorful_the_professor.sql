CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(40) NOT NULL,
	"email" varchar(345) NOT NULL,
	"password" varchar(50) NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now() NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL
);
