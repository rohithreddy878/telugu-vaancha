import {
  pgTable,
  serial,
  varchar,
  boolean,
  smallint,
  bigint,
  text,
  primaryKey,
  unique,
  index,
} from "drizzle-orm/pg-core";

// =====================
// MOVIES
// =====================
export const movies = pgTable(
  "movies",
  {
    movie_id: serial("movie_id").primaryKey(),
    movie_name: varchar("movie_name", { length: 255 }).notNull(),
    movie_name_telugu: varchar("movie_name_telugu", { length: 255 }).notNull(),
    year: smallint("year").notNull(),
    songs_filled: smallint("songs_filled").default(0).notNull(),
  },
  (table) => ({
    uniqueMovie: unique("unique_movie").on(table.movie_name, table.year),
    movieNameIdx: index("idx_movies_name").on(table.movie_name),
  })
);

// =====================
// ARTISTS
// =====================
export const artists = pgTable(
  "artists",
  {
    artist_id: serial("artist_id").primaryKey(),
    artist_name: varchar("artist_name", { length: 255 }).notNull(),
    artist_name_telugu: varchar("artist_name_telugu", { length: 255 }).notNull(),
    is_actor: boolean("is_actor").default(false),
    is_singer: boolean("is_singer").default(false),
    is_composer: boolean("is_composer").default(false),
    is_lyricist: boolean("is_lyricist").default(false),
  },
  (table) => ({
    uniqueArtist: unique("unique_artist").on(table.artist_name),
    artistNameIdx: index("idx_artists_name").on(table.artist_name),
  })
);

// =====================
// SONGS
// =====================
export const songs = pgTable(
  "songs",
  {
    song_id: serial("song_id").primaryKey(),
    song_name: varchar("song_name", { length: 255 }).notNull(),
    song_name_telugu: varchar("song_name_telugu", { length: 255 }).notNull(),
    movie_id: bigint("movie_id", { mode: "number" }).notNull(),
  },
  (table) => ({
    uniqueSong: unique("unique_song").on(table.song_name, table.movie_id),
    songNameIdx: index("idx_songs_name").on(table.song_name),
  })
);

// =====================
// LYRICS
// =====================
export const lyrics = pgTable(
  "lyrics",
  {
    lyric_id: serial("lyric_id").primaryKey(),
    song_id: bigint("song_id", { mode: "number" }).notNull(),
    telugu_lyrics: text("telugu_lyrics").notNull(),
    english_lyrics: text("english_lyrics").notNull(),
    english_translated_subs: text("english_translated_subs"),
  },
  (table) => ({
    uniqueSongId: unique("unique_lyrics_song_id").on(table.song_id),
  })
);

// =====================
// SONG ↔ ARTIST LINKS
// =====================
export const songArtistLinks = pgTable(
  "song_artist_links",
  {
    song_artist_link_id: serial("song_artist_link_id").primaryKey(),
    song_id: bigint("song_id", { mode: "number" }).notNull(),
    artist_id: bigint("artist_id", { mode: "number" }).notNull(),
    role: varchar("role", { length: 50 }).notNull(),
  },
  (table) => ({
    uniqueSongArtistRole: unique("unique_song_artist_role").on(
      table.song_id,
      table.artist_id,
      table.role
    ),
  })
);



// =====================
// MOVIE ↔ ARTIST LINKS
// =====================
export const movieArtistLinks = pgTable("movie_artist_links", {
  movie_artist_link_id: serial("movie_artist_link_id").primaryKey(),

  movie_id: bigint("movie_id", { mode: "number" })
    .notNull()
    .references(() => movies.movie_id, { onDelete: "cascade" }),

  artist_id: bigint("artist_id", { mode: "number" })
    .notNull()
    .references(() => artists.artist_id, { onDelete: "cascade" }),

  role: varchar("role", { length: 50 }).notNull(),
});