-- uuid
CREATE EXTENSION "uuid-ossp";

-- CreateEnum
CREATE TYPE "contact_type" AS ENUM ('email', 'phone');

-- CreateTable
CREATE TABLE "user" (
    "user_id" SERIAL NOT NULL,
    "slug" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "wallet" (
    "wallet_id" SERIAL NOT NULL,
    "slug" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "address" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "wallet_pkey" PRIMARY KEY ("wallet_id")
);

-- CreateTable
CREATE TABLE "contact" (
    "contact_id" SERIAL NOT NULL,
    "slug" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "type" "contact_type" NOT NULL,
    "value" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("contact_id")
);

-- CreateTable
CREATE TABLE "scan" (
    "scan_id" SERIAL NOT NULL,
    "slug" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "transaction_hash" TEXT NOT NULL,
    "block_hash" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wallet_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,

    CONSTRAINT "scan_pkey" PRIMARY KEY ("scan_id")
);

-- CreateTable
CREATE TABLE "score" (
    "score_id" SERIAL NOT NULL,
    "slug" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "value" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "score_pkey" PRIMARY KEY ("score_id")
);

-- CreateTable
CREATE TABLE "blockchain" (
    "blockchain_id" SERIAL NOT NULL,
    "slug" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blockchain_pkey" PRIMARY KEY ("blockchain_id")
);

-- CreateTable
CREATE TABLE "protocol" (
    "protocol_id" SERIAL NOT NULL,
    "slug" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "protocol_pkey" PRIMARY KEY ("protocol_id")
);

-- CreateTable
CREATE TABLE "blockchain_protocol" (
    "blockchain_protocol_id" SERIAL NOT NULL,
    "blockchain_id" INTEGER NOT NULL,
    "protocol_id" INTEGER NOT NULL,

    CONSTRAINT "blockchain_protocol_pkey" PRIMARY KEY ("blockchain_protocol_id")
);

-- CreateTable
CREATE TABLE "category" (
    "category_id" SERIAL NOT NULL,
    "slug" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "contract" (
    "contract_id" SERIAL NOT NULL,
    "slug" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "address" TEXT NOT NULL,
    "abi" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category_id" INTEGER NOT NULL,
    "blockchain_protocol_id" INTEGER NOT NULL,

    CONSTRAINT "contract_pkey" PRIMARY KEY ("contract_id")
);

-- CreateTable
CREATE TABLE "event" (
    "event_id" SERIAL NOT NULL,
    "slug" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contract_id" INTEGER NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "score_contract" (
    "score_contract_id" SERIAL NOT NULL,
    "last_block" INTEGER NOT NULL,
    "score_id" INTEGER NOT NULL,
    "contract_id" INTEGER NOT NULL,
    "blockchain_id" INTEGER NOT NULL,

    CONSTRAINT "score_contract_pkey" PRIMARY KEY ("score_contract_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_slug_key" ON "user"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_slug_key" ON "wallet"("slug");

-- CreateIndex
CREATE INDEX "wallet_user_id_idx" ON "wallet"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "contact_slug_key" ON "contact"("slug");

-- CreateIndex
CREATE INDEX "contact_user_id_idx" ON "contact"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "scan_slug_key" ON "scan"("slug");

-- CreateIndex
CREATE INDEX "scan_wallet_id_idx" ON "scan"("wallet_id");

-- CreateIndex
CREATE INDEX "scan_event_id_idx" ON "scan"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "score_slug_key" ON "score"("slug");

-- CreateIndex
CREATE INDEX "score_user_id_idx" ON "score"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "blockchain_slug_key" ON "blockchain"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "protocol_slug_key" ON "protocol"("slug");

-- CreateIndex
CREATE INDEX "blockchain_protocol_blockchain_id_idx" ON "blockchain_protocol"("blockchain_id");

-- CreateIndex
CREATE INDEX "blockchain_protocol_protocol_id_idx" ON "blockchain_protocol"("protocol_id");

-- CreateIndex
CREATE UNIQUE INDEX "category_slug_key" ON "category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "contract_slug_key" ON "contract"("slug");

-- CreateIndex
CREATE INDEX "contract_category_id_idx" ON "contract"("category_id");

-- CreateIndex
CREATE INDEX "contract_blockchain_protocol_id_idx" ON "contract"("blockchain_protocol_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_slug_key" ON "event"("slug");

-- CreateIndex
CREATE INDEX "event_contract_id_idx" ON "event"("contract_id");

-- CreateIndex
CREATE INDEX "score_contract_score_id_idx" ON "score_contract"("score_id");

-- CreateIndex
CREATE INDEX "score_contract_contract_id_idx" ON "score_contract"("contract_id");

-- CreateIndex
CREATE INDEX "score_contract_blockchain_id_idx" ON "score_contract"("blockchain_id");
