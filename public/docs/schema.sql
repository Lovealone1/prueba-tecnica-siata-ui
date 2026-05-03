-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

COMMENT ON SCHEMA public IS 'standard public schema';

-- DROP TYPE public."citext";

CREATE TYPE public."citext" (
	INPUT = citextin,
	OUTPUT = citextout,
	RECEIVE = citextrecv,
	SEND = citextsend,
	ALIGNMENT = 4,
	STORAGE = any,
	CATEGORY = S,
	DELIMITER = ',',
	COLLATABLE = true);

-- DROP TYPE public."globalrole";

CREATE TYPE public."globalrole" AS ENUM (
	'ADMIN',
	'USER');

-- DROP TYPE public."product_size_enum";

CREATE TYPE public."product_size_enum" AS ENUM (
	'SMALL',
	'MEDIUM',
	'LARGE',
	'EXTRA_LARGE');

-- DROP TYPE public."shipping_status_enum";

CREATE TYPE public."shipping_status_enum" AS ENUM (
	'PENDING',
	'SENT',
	'DELIVERED');

-- DROP TYPE public."shipping_type_enum";

CREATE TYPE public."shipping_type_enum" AS ENUM (
	'LAND',
	'MARITIME');

-- DROP TYPE public."transport_mode_enum";

CREATE TYPE public."transport_mode_enum" AS ENUM (
	'LAND',
	'MARITIME');
-- public.alembic_version definition

-- Drop table

-- DROP TABLE public.alembic_version;

CREATE TABLE public.alembic_version (
	version_num varchar(32) NOT NULL,
	CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);


-- public.customers definition

-- Drop table

-- DROP TABLE public.customers;

CREATE TABLE public.customers (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(255) NOT NULL,
	identifier varchar(255) NOT NULL,
	email public."citext" NOT NULL,
	phone varchar(255) NULL,
	address text NULL,
	created_at timestamptz(0) DEFAULT now() NOT NULL,
	updated_at timestamptz(0) DEFAULT now() NOT NULL,
	CONSTRAINT check_customers_email_lowercase CHECK (((email)::text = lower(TRIM(BOTH FROM email)))),
	CONSTRAINT customers_email_key UNIQUE (email),
	CONSTRAINT customers_identifier_key UNIQUE (identifier),
	CONSTRAINT customers_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_customers_email ON public.customers USING btree (lower(TRIM(BOTH FROM email)));
CREATE INDEX idx_customers_identifier ON public.customers USING btree (identifier);


-- public.products definition

-- Drop table

-- DROP TABLE public.products;

CREATE TABLE public.products (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(150) NOT NULL,
	description text NULL,
	product_type varchar(50) NOT NULL,
	transport_mode public."transport_mode_enum" NOT NULL,
	"size" public."product_size_enum" DEFAULT 'MEDIUM'::product_size_enum NOT NULL,
	created_at timestamptz(0) DEFAULT now() NOT NULL,
	CONSTRAINT products_pkey PRIMARY KEY (id)
);


-- public.seaports definition

-- Drop table

-- DROP TABLE public.seaports;

CREATE TABLE public.seaports (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(150) NOT NULL,
	address varchar(255) NOT NULL,
	city varchar(100) NOT NULL,
	country varchar(100) NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	continent varchar(50) NOT NULL,
	CONSTRAINT seaports_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_seaports_location ON public.seaports USING btree (city, country);
CREATE INDEX idx_seaports_name ON public.seaports USING btree (name);


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	email public."citext" NOT NULL,
	first_name varchar(255) NULL,
	last_name varchar(255) NULL,
	phone_number varchar(255) NULL,
	is_active bool DEFAULT true NOT NULL,
	global_role public."globalrole" DEFAULT 'USER'::globalrole NOT NULL,
	last_login_at timestamptz(0) NULL,
	created_at timestamptz(0) DEFAULT now() NOT NULL,
	updated_at timestamptz(0) DEFAULT now() NOT NULL,
	CONSTRAINT check_users_email_lowercase CHECK (((email)::text = lower(TRIM(BOTH FROM email)))),
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_users_email ON public.users USING btree (lower(TRIM(BOTH FROM email)));


-- public.warehouses definition

-- Drop table

-- DROP TABLE public.warehouses;

CREATE TABLE public.warehouses (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(150) NOT NULL,
	address varchar(255) NOT NULL,
	city varchar(100) NOT NULL,
	country varchar(100) NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	continent varchar(50) NOT NULL,
	CONSTRAINT warehouses_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_warehouses_location ON public.warehouses USING btree (city, country);
CREATE INDEX idx_warehouses_name ON public.warehouses USING btree (name);


-- public.shipments definition

-- Drop table

-- DROP TABLE public.shipments;

CREATE TABLE public.shipments (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	customer_id uuid NOT NULL,
	product_id uuid NOT NULL,
	warehouse_id uuid NULL,
	seaport_id uuid NULL,
	product_quantity int4 NOT NULL,
	shipping_type public."shipping_type_enum" NOT NULL,
	base_price numeric(12, 2) NOT NULL,
	discount_percentage float8 DEFAULT 0.0 NULL,
	total_price numeric(12, 2) NOT NULL,
	dispatch_location varchar(100) DEFAULT 'USA'::character varying NOT NULL,
	dispatch_continent varchar(100) DEFAULT 'North America'::character varying NOT NULL,
	guide_number varchar(50) NOT NULL,
	vehicle_plate varchar(6) NULL,
	fleet_number varchar(8) NULL,
	registry_date timestamptz(0) DEFAULT now() NULL,
	shipping_date timestamptz(0) NOT NULL,
	shipping_status public."shipping_status_enum" DEFAULT 'PENDING'::shipping_status_enum NOT NULL,
	created_at timestamptz(0) DEFAULT now() NOT NULL,
	updated_at timestamptz(0) DEFAULT now() NOT NULL,
	CONSTRAINT shipments_guide_number_key UNIQUE (guide_number),
	CONSTRAINT shipments_pkey PRIMARY KEY (id),
	CONSTRAINT shipments_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE,
	CONSTRAINT shipments_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
	CONSTRAINT shipments_seaport_id_fkey FOREIGN KEY (seaport_id) REFERENCES public.seaports(id) ON DELETE SET NULL,
	CONSTRAINT shipments_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON DELETE SET NULL
);
CREATE INDEX idx_shipments_guide_number ON public.shipments USING btree (guide_number);


-- public.shipment_status_logs definition

-- Drop table

-- DROP TABLE public.shipment_status_logs;

CREATE TABLE public.shipment_status_logs (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	shipment_id uuid NOT NULL,
	old_status varchar(50) NULL,
	new_status varchar(50) NOT NULL,
	reason text NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT shipment_status_logs_pkey PRIMARY KEY (id),
	CONSTRAINT shipment_status_logs_shipment_id_fkey FOREIGN KEY (shipment_id) REFERENCES public.shipments(id) ON DELETE CASCADE
);
CREATE INDEX idx_shipment_status_logs_shipment_id ON public.shipment_status_logs USING btree (shipment_id);



-- DROP FUNCTION public."citext"(bpchar);

CREATE OR REPLACE FUNCTION public.citext(character)
 RETURNS citext
 LANGUAGE internal
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$rtrim1$function$
;

-- DROP FUNCTION public."citext"(inet);

CREATE OR REPLACE FUNCTION public.citext(inet)
 RETURNS citext
 LANGUAGE internal
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$network_show$function$
;

-- DROP FUNCTION public."citext"(bool);

CREATE OR REPLACE FUNCTION public.citext(boolean)
 RETURNS citext
 LANGUAGE internal
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$booltext$function$
;

-- DROP FUNCTION public.citext_cmp(citext, citext);

CREATE OR REPLACE FUNCTION public.citext_cmp(citext, citext)
 RETURNS integer
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/citext', $function$citext_cmp$function$
;

-- DROP FUNCTION public.citext_eq(citext, citext);

CREATE OR REPLACE FUNCTION public.citext_eq(citext, citext)
 RETURNS boolean
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/citext', $function$citext_eq$function$
;

-- DROP FUNCTION public.citext_ge(citext, citext);

CREATE OR REPLACE FUNCTION public.citext_ge(citext, citext)
 RETURNS boolean
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/citext', $function$citext_ge$function$
;

-- DROP FUNCTION public.citext_gt(citext, citext);

CREATE OR REPLACE FUNCTION public.citext_gt(citext, citext)
 RETURNS boolean
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/citext', $function$citext_gt$function$
;

-- DROP FUNCTION public.citext_hash(citext);

CREATE OR REPLACE FUNCTION public.citext_hash(citext)
 RETURNS integer
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/citext', $function$citext_hash$function$
;

-- DROP FUNCTION public.citext_hash_extended(citext, int8);

CREATE OR REPLACE FUNCTION public.citext_hash_extended(citext, bigint)
 RETURNS bigint
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/citext', $function$citext_hash_extended$function$
;

-- DROP FUNCTION public.citext_larger(citext, citext);

CREATE OR REPLACE FUNCTION public.citext_larger(citext, citext)
 RETURNS citext
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/citext', $function$citext_larger$function$
;

-- DROP FUNCTION public.citext_le(citext, citext);

CREATE OR REPLACE FUNCTION public.citext_le(citext, citext)
 RETURNS boolean
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/citext', $function$citext_le$function$
;

-- DROP FUNCTION public.citext_lt(citext, citext);

CREATE OR REPLACE FUNCTION public.citext_lt(citext, citext)
 RETURNS boolean
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/citext', $function$citext_lt$function$
;

-- DROP FUNCTION public.citext_ne(citext, citext);

CREATE OR REPLACE FUNCTION public.citext_ne(citext, citext)
 RETURNS boolean
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/citext', $function$citext_ne$function$
;

-- DROP FUNCTION public.citext_pattern_cmp(citext, citext);

CREATE OR REPLACE FUNCTION public.citext_pattern_cmp(citext, citext)
 RETURNS integer
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/citext', $function$citext_pattern_cmp$function$
;

-- DROP FUNCTION public.citext_pattern_ge(citext, citext);

CREATE OR REPLACE FUNCTION public.citext_pattern_ge(citext, citext)
 RETURNS boolean
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/citext', $function$citext_pattern_ge$function$
;

-- DROP FUNCTION public.citext_pattern_gt(citext, citext);

CREATE OR REPLACE FUNCTION public.citext_pattern_gt(citext, citext)
 RETURNS boolean
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/citext', $function$citext_pattern_gt$function$
;

-- DROP FUNCTION public.citext_pattern_le(citext, citext);

CREATE OR REPLACE FUNCTION public.citext_pattern_le(citext, citext)
 RETURNS boolean
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/citext', $function$citext_pattern_le$function$
;

-- DROP FUNCTION public.citext_pattern_lt(citext, citext);

CREATE OR REPLACE FUNCTION public.citext_pattern_lt(citext, citext)
 RETURNS boolean
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/citext', $function$citext_pattern_lt$function$
;

-- DROP FUNCTION public.citext_smaller(citext, citext);

CREATE OR REPLACE FUNCTION public.citext_smaller(citext, citext)
 RETURNS citext
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/citext', $function$citext_smaller$function$
;

-- DROP FUNCTION public.citextin(cstring);

CREATE OR REPLACE FUNCTION public.citextin(cstring)
 RETURNS citext
 LANGUAGE internal
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$textin$function$
;

-- DROP FUNCTION public.citextout(citext);

CREATE OR REPLACE FUNCTION public.citextout(citext)
 RETURNS cstring
 LANGUAGE internal
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$textout$function$
;

-- DROP FUNCTION public.citextrecv(internal);

CREATE OR REPLACE FUNCTION public.citextrecv(internal)
 RETURNS citext
 LANGUAGE internal
 STABLE PARALLEL SAFE STRICT
AS $function$textrecv$function$
;

-- DROP FUNCTION public.citextsend(citext);

CREATE OR REPLACE FUNCTION public.citextsend(citext)
 RETURNS bytea
 LANGUAGE internal
 STABLE PARALLEL SAFE STRICT
AS $function$textsend$function$
;

-- DROP AGGREGATE public.max(citext);

CREATE OR REPLACE AGGREGATE public.max(public.citext) (
	SFUNC = citext_larger,
	STYPE = citext,
	SORTOP = >
);

-- DROP AGGREGATE public.min(citext);

CREATE OR REPLACE AGGREGATE public.min(public.citext) (
	SFUNC = citext_smaller,
	STYPE = citext,
	SORTOP = <
);

-- DROP FUNCTION public.regexp_match(citext, citext, text);

CREATE OR REPLACE FUNCTION public.regexp_match(citext, citext, text)
 RETURNS text[]
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$
    SELECT pg_catalog.regexp_match( $1::pg_catalog.text, $2::pg_catalog.text, CASE WHEN pg_catalog.strpos($3, 'c') = 0 THEN  $3 || 'i' ELSE $3 END );
$function$
;

-- DROP FUNCTION public.regexp_match(citext, citext);

CREATE OR REPLACE FUNCTION public.regexp_match(citext, citext)
 RETURNS text[]
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$
    SELECT pg_catalog.regexp_match( $1::pg_catalog.text, $2::pg_catalog.text, 'i' );
$function$
;

-- DROP FUNCTION public.regexp_matches(citext, citext);

CREATE OR REPLACE FUNCTION public.regexp_matches(citext, citext)
 RETURNS SETOF text[]
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE STRICT ROWS 1
AS $function$
    SELECT pg_catalog.regexp_matches( $1::pg_catalog.text, $2::pg_catalog.text, 'i' );
$function$
;

-- DROP FUNCTION public.regexp_matches(citext, citext, text);

CREATE OR REPLACE FUNCTION public.regexp_matches(citext, citext, text)
 RETURNS SETOF text[]
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE STRICT ROWS 10
AS $function$
    SELECT pg_catalog.regexp_matches( $1::pg_catalog.text, $2::pg_catalog.text, CASE WHEN pg_catalog.strpos($3, 'c') = 0 THEN  $3 || 'i' ELSE $3 END );
$function$
;

-- DROP FUNCTION public.regexp_replace(citext, citext, text, text);

CREATE OR REPLACE FUNCTION public.regexp_replace(citext, citext, text, text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$
    SELECT pg_catalog.regexp_replace( $1::pg_catalog.text, $2::pg_catalog.text, $3, CASE WHEN pg_catalog.strpos($4, 'c') = 0 THEN  $4 || 'i' ELSE $4 END);
$function$
;

-- DROP FUNCTION public.regexp_replace(citext, citext, text);

CREATE OR REPLACE FUNCTION public.regexp_replace(citext, citext, text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$
    SELECT pg_catalog.regexp_replace( $1::pg_catalog.text, $2::pg_catalog.text, $3, 'i');
$function$
;

-- DROP FUNCTION public.regexp_split_to_array(citext, citext, text);

CREATE OR REPLACE FUNCTION public.regexp_split_to_array(citext, citext, text)
 RETURNS text[]
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$
    SELECT pg_catalog.regexp_split_to_array( $1::pg_catalog.text, $2::pg_catalog.text, CASE WHEN pg_catalog.strpos($3, 'c') = 0 THEN  $3 || 'i' ELSE $3 END );
$function$
;

-- DROP FUNCTION public.regexp_split_to_array(citext, citext);

CREATE OR REPLACE FUNCTION public.regexp_split_to_array(citext, citext)
 RETURNS text[]
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$
    SELECT pg_catalog.regexp_split_to_array( $1::pg_catalog.text, $2::pg_catalog.text, 'i' );
$function$
;

-- DROP FUNCTION public.regexp_split_to_table(citext, citext);

CREATE OR REPLACE FUNCTION public.regexp_split_to_table(citext, citext)
 RETURNS SETOF text
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$
    SELECT pg_catalog.regexp_split_to_table( $1::pg_catalog.text, $2::pg_catalog.text, 'i' );
$function$
;

-- DROP FUNCTION public.regexp_split_to_table(citext, citext, text);

CREATE OR REPLACE FUNCTION public.regexp_split_to_table(citext, citext, text)
 RETURNS SETOF text
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$
    SELECT pg_catalog.regexp_split_to_table( $1::pg_catalog.text, $2::pg_catalog.text, CASE WHEN pg_catalog.strpos($3, 'c') = 0 THEN  $3 || 'i' ELSE $3 END );
$function$
;

-- DROP FUNCTION public."replace"(citext, citext, citext);

CREATE OR REPLACE FUNCTION public.replace(citext, citext, citext)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$
    SELECT pg_catalog.regexp_replace( $1::pg_catalog.text, pg_catalog.regexp_replace($2::pg_catalog.text, '([^a-zA-Z_0-9])', E'\\\\\\1', 'g'), $3::pg_catalog.text, 'gi' );
$function$
;

-- DROP FUNCTION public.split_part(citext, citext, int4);

CREATE OR REPLACE FUNCTION public.split_part(citext, citext, integer)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$
    SELECT (pg_catalog.regexp_split_to_array( $1::pg_catalog.text, pg_catalog.regexp_replace($2::pg_catalog.text, '([^a-zA-Z_0-9])', E'\\\\\\1', 'g'), 'i'))[$3];
$function$
;

-- DROP FUNCTION public.strpos(citext, citext);

CREATE OR REPLACE FUNCTION public.strpos(citext, citext)
 RETURNS integer
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$
    SELECT pg_catalog.strpos( pg_catalog.lower( $1::pg_catalog.text ), pg_catalog.lower( $2::pg_catalog.text ) );
$function$
;

-- DROP FUNCTION public.texticlike(citext, citext);

CREATE OR REPLACE FUNCTION public.texticlike(citext, citext)
 RETURNS boolean
 LANGUAGE internal
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$texticlike$function$
;

-- DROP FUNCTION public.texticlike(citext, text);

CREATE OR REPLACE FUNCTION public.texticlike(citext, text)
 RETURNS boolean
 LANGUAGE internal
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$texticlike$function$
;

-- DROP FUNCTION public.texticnlike(citext, citext);

CREATE OR REPLACE FUNCTION public.texticnlike(citext, citext)
 RETURNS boolean
 LANGUAGE internal
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$texticnlike$function$
;

-- DROP FUNCTION public.texticnlike(citext, text);

CREATE OR REPLACE FUNCTION public.texticnlike(citext, text)
 RETURNS boolean
 LANGUAGE internal
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$texticnlike$function$
;

-- DROP FUNCTION public.texticregexeq(citext, text);

CREATE OR REPLACE FUNCTION public.texticregexeq(citext, text)
 RETURNS boolean
 LANGUAGE internal
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$texticregexeq$function$
;

-- DROP FUNCTION public.texticregexeq(citext, citext);

CREATE OR REPLACE FUNCTION public.texticregexeq(citext, citext)
 RETURNS boolean
 LANGUAGE internal
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$texticregexeq$function$
;

-- DROP FUNCTION public.texticregexne(citext, citext);

CREATE OR REPLACE FUNCTION public.texticregexne(citext, citext)
 RETURNS boolean
 LANGUAGE internal
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$texticregexne$function$
;

-- DROP FUNCTION public.texticregexne(citext, text);

CREATE OR REPLACE FUNCTION public.texticregexne(citext, text)
 RETURNS boolean
 LANGUAGE internal
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$texticregexne$function$
;

-- DROP FUNCTION public."translate"(citext, citext, text);

CREATE OR REPLACE FUNCTION public.translate(citext, citext, text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$
    SELECT pg_catalog.translate( pg_catalog.translate( $1::pg_catalog.text, pg_catalog.lower($2::pg_catalog.text), $3), pg_catalog.upper($2::pg_catalog.text), $3);
$function$
;

-- DROP FUNCTION public.uuid_generate_v1();

CREATE OR REPLACE FUNCTION public.uuid_generate_v1()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1$function$
;

-- DROP FUNCTION public.uuid_generate_v1mc();

CREATE OR REPLACE FUNCTION public.uuid_generate_v1mc()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1mc$function$
;

-- DROP FUNCTION public.uuid_generate_v3(uuid, text);

CREATE OR REPLACE FUNCTION public.uuid_generate_v3(namespace uuid, name text)
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v3$function$
;

-- DROP FUNCTION public.uuid_generate_v4();

CREATE OR REPLACE FUNCTION public.uuid_generate_v4()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v4$function$
;

-- DROP FUNCTION public.uuid_generate_v5(uuid, text);

CREATE OR REPLACE FUNCTION public.uuid_generate_v5(namespace uuid, name text)
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v5$function$
;

-- DROP FUNCTION public.uuid_nil();

CREATE OR REPLACE FUNCTION public.uuid_nil()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_nil$function$
;

-- DROP FUNCTION public.uuid_ns_dns();

CREATE OR REPLACE FUNCTION public.uuid_ns_dns()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_dns$function$
;

-- DROP FUNCTION public.uuid_ns_oid();

CREATE OR REPLACE FUNCTION public.uuid_ns_oid()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_oid$function$
;

-- DROP FUNCTION public.uuid_ns_url();

CREATE OR REPLACE FUNCTION public.uuid_ns_url()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_url$function$
;

-- DROP FUNCTION public.uuid_ns_x500();

CREATE OR REPLACE FUNCTION public.uuid_ns_x500()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_x500$function$
;
