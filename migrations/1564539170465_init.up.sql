SET xmloption = content;
CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);
CREATE TABLE public.extras (
    id bigint NOT NULL,
    name character varying,
    price integer,
    extra_type integer DEFAULT 0,
    image_url character varying,
    active boolean DEFAULT true
);
CREATE SEQUENCE public.extras_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.extras_id_seq OWNED BY public.extras.id;
CREATE TABLE public.order_extras (
    id bigint NOT NULL,
    order_id bigint,
    extra_id bigint,
    quantity integer
);
CREATE SEQUENCE public.order_extras_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.order_extras_id_seq OWNED BY public.order_extras.id;
CREATE TABLE public.orders (
    id bigint NOT NULL,
    service_id bigint,
    start_time timestamp without time zone,
    end_time timestamp without time zone,
    closed_at timestamp without time zone
);
CREATE SEQUENCE public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;
CREATE TABLE public.reservations (
    id bigint NOT NULL,
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone NOT NULL,
    service_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);
CREATE SEQUENCE public.reservations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.reservations_id_seq OWNED BY public.reservations.id;
CREATE TABLE public.room_discount_day_events (
    id bigint NOT NULL,
    day_of_week integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);
CREATE SEQUENCE public.room_discount_day_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.room_discount_day_events_id_seq OWNED BY public.room_discount_day_events.id;
CREATE TABLE public.room_pricing_events (
    id bigint NOT NULL,
    pricing_factor double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);
CREATE SEQUENCE public.room_pricing_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.room_pricing_events_id_seq OWNED BY public.room_pricing_events.id;
CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);
CREATE TABLE public.services (
    id bigint NOT NULL,
    name character varying,
    hourly_rate integer,
    "position" integer,
    service_type integer DEFAULT 0
);
CREATE SEQUENCE public.services_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;
ALTER TABLE ONLY public.extras ALTER COLUMN id SET DEFAULT nextval('public.extras_id_seq'::regclass);
ALTER TABLE ONLY public.order_extras ALTER COLUMN id SET DEFAULT nextval('public.order_extras_id_seq'::regclass);
ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);
ALTER TABLE ONLY public.reservations ALTER COLUMN id SET DEFAULT nextval('public.reservations_id_seq'::regclass);
ALTER TABLE ONLY public.room_discount_day_events ALTER COLUMN id SET DEFAULT nextval('public.room_discount_day_events_id_seq'::regclass);
ALTER TABLE ONLY public.room_pricing_events ALTER COLUMN id SET DEFAULT nextval('public.room_pricing_events_id_seq'::regclass);
ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);
ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);
ALTER TABLE ONLY public.extras
    ADD CONSTRAINT extras_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.order_extras
    ADD CONSTRAINT order_extras_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.room_discount_day_events
    ADD CONSTRAINT room_discount_day_events_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.room_pricing_events
    ADD CONSTRAINT room_pricing_events_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);
ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);
CREATE INDEX index_order_extras_on_extra_id ON public.order_extras USING btree (extra_id);
CREATE INDEX index_order_extras_on_order_id ON public.order_extras USING btree (order_id);
CREATE INDEX index_orders_on_service_id ON public.orders USING btree (service_id);
CREATE INDEX index_reservations_on_service_id ON public.reservations USING btree (service_id);
ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_rails_4d159e34c4 FOREIGN KEY (service_id) REFERENCES public.services(id);
ALTER TABLE ONLY public.order_extras
    ADD CONSTRAINT fk_rails_9dbdce423f FOREIGN KEY (extra_id) REFERENCES public.extras(id);
ALTER TABLE ONLY public.order_extras
    ADD CONSTRAINT fk_rails_b3eb6531c5 FOREIGN KEY (order_id) REFERENCES public.orders(id);
ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT fk_rails_c96835bc2f FOREIGN KEY (service_id) REFERENCES public.services(id);
