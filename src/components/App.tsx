import { useEffect, useState } from "react";

import Filter from "./Filter";
import { createDefaultFilter, useStethoscopeFilter } from "../utils/filter";
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
  const audioRef = useRef<HTMLAudioElement>(null)
  const [gain, setGain] = useStethoscopeFilter(filterNodes, stream);

  const handleAddFilter = () => {
    setFilterNodes([...filterNodes, createDefaultFilter()]);
  };

  const handleRemoveFilter = (index: number) => {
    setFilterNodes(filterNodes.filter((_, idx) => idx !== index));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "fit-content" }}>
      <div style={{ padding: 5 }}>
        Common gain
        <input
          style={{ width: 100, margin: "0 5px" }}
          type="number"
          value={gain}
          onChange={({ target }) => setGain(Number(target.value))}
        />
        <button style={{ width: 100 }} onClick={handleAddFilter}>Add</button>
      </div>
      {filterNodes.map((filter, index, { length }) => (
        <Filter
          key={`${length}-${index}`}
          filter={filter}
          onRemove={() => handleRemoveFilter(index)}
        />
      ))}
      <audio ref={audioRef} autoPlay muted/>
    </div>
  );
}

export default App;
