import { useEffect, useState } from "react";

import Filter from "./Filter";
import Analyser from "./Analizer"
import { createDefaultFilter, gainNode, useStethoscopeFilter } from "../utils/filter";
import { useRef } from "react";

function App() {
  const [filterNodes, setFilterNodes] = useState<BiquadFilterNode[]>([]);
  const [stream, setStream] = useState<MediaStream>();
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(setStream)
      .catch(alert);
  }, []);
  useEffect(() => {
    if (!audioRef.current || !stream) {
      return
    }
    audioRef.current.srcObject = stream
  }, [stream])
  const audioRef = useRef<HTMLAudioElement>(null);
  useStethoscopeFilter(filterNodes, stream);
  const [gain, setGain] = useState(1);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (muted) {
      gainNode.gain.value = 0;
    } else {
      gainNode.gain.value = gain;
    }
  }, [gain, muted])

  const handleAddFilter = () => {
    setFilterNodes([...filterNodes, createDefaultFilter()]);
  };

  const handleRemoveFilter = (index: number) => {
    setFilterNodes(filterNodes.filter((_, idx) => idx !== index));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "fit-content" }}>
      <Analyser />
      <div style={{ padding: 5 }}>
        Common gain
        <input
          disabled={muted}
          style={{ width: 100, margin: "0 5px" }}
          type="number"
          value={gain}
          onChange={({ target }) => setGain(Number(target.value))}
        />
        <button style={{ width: 100 }} onClick={() => setMuted(s => !s)}>{muted ? 'Unmute' : 'Mute'}</button>
        <button style={{ width: 100 }} onClick={handleAddFilter}>Add</button>
      </div>
      {filterNodes.map((filter, index, { length }) => (
        <Filter
          key={`${length}-${index}`}
          filter={filter}
          onRemove={() => handleRemoveFilter(index)}
        />
      ))}
    </div>
  );
}

export default App;
