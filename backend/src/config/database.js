module.exports = {
  dialect: "postgres",
  host: "localhost",
  username: "postgres",
  password: "dockerfastfeet",
  database: "fastfeet",

  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
};
