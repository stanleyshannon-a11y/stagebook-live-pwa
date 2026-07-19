/*
 * EDIT THIS FILE to replace the sample band, songs, and setlists.
 * Song IDs must be unique. Setlists refer to those IDs in their songIds arrays.
 * Lyrics use ordinary \n line breaks; a blank line separates verses.
 * Artwork may be a local path (best for offline use) or an empty string.
 */
window.STAGEBOOK_DATA = {
  band: {
    name: "The Night Signals",
    subtitle: "StageBook Live",
    artwork: "assets/sample-artwork.svg"
  },
  songs: [
    {
      id: "open-road",
      title: "Open Road",
      note: "Count 4 · Key: G",
      artwork: "assets/sample-artwork.svg",
      lyrics: `Streetlights fade behind us
Morning climbs the dashboard slow
Every mile is a promise
On the open road we go

Hold the line, keep it steady
Let the whole night know
We were born ready
For the open road`
    },
    {
      id: "afterglow",
      title: "Afterglow",
      note: "Start on vocal · Key: Dm",
      artwork: "",
      lyrics: `Wait until the room goes quiet
Let the last chord breathe
All the sparks we started
Are brighter when we leave

Meet me in the afterglow
Where the shadows turn to gold
One more song before we go
One more story to be told`
    },
    {
      id: "home-tonight",
      title: "Home Tonight",
      note: "Half-time final chorus · Key: C",
      artwork: "",
      lyrics: `Windows down, the air is changing
City falling out of sight
If this road keeps rearranging
We'll still make it home tonight

Home tonight, home tonight
Follow every porch-light burning
Home tonight, home tonight
Every wheel is always turning`
    }
  ],
  setlists: [
    {
      id: "sample-show",
      name: "Sample Show",
      detail: "3 songs · Replace in data.js",
      songIds: ["open-road", "afterglow", "home-tonight"]
    },
    {
      id: "short-set",
      name: "Short Set",
      detail: "2 songs",
      songIds: ["afterglow", "home-tonight"]
    }
  ]
};
