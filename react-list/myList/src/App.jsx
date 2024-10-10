import { useState } from "react";
import "./App.css";

function App() {
  const initialArtists = [
    { id: 1, name: "Adele" },
    { id: 2, name: "Ed Sheeran" },
  ];
  const [artists, setArtists] = useState(initialArtists);
  const [newArtist, setNewArtist] = useState("");

  return (
    <>
      <div className="App">
        <div className="App-header">
          <h1>My Favorite Artists</h1>
        </div>
        <div className="App-add-new">
          <input
            type="text"
            value={newArtist}
            onChange={(e) => setNewArtist(e.target.value)}
          />
          <button
            onClick={() =>
              setArtists([
                ...artists,
                { id: artists.length + 1, name: newArtist },
              ])
            }
          >
            {" "}
            Add Artist{" "}
          </button>
        </div>
        <div className="App-list">
          <ul>
            {artists.map((artist) => (
              <li key={artist.id}>
                {" "}
                {artist.name}{" "}
                <button
                  onClick={() =>
                    setArtists(artists.filter((a) => a.id !== artist.id))
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
