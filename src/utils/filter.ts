import { useEffect, useReducer } from "react";

export const stethoscopeGain = {
  default: 1,
  min: 1,
  max: 40,
};

const audioContext = new AudioContext();
const gainNode = audioContext.createGain();

export const createDefaultFilter = () => {
  const filter = audioContext.createBiquadFilter();
  filter.type = "allpass";
  return filter;
};

export const useStethoscopeFilter = (
  biquadFilters: BiquadFilterNode[],
  stream?: MediaStream
) => {
  useEffect(() => {
    if (!stream) {
      return;
    }
    const source = audioContext.createMediaStreamSource(stream);
    const gainNode = audioContext.createGain();
    gainNode.gain.value = stethoscopeGain.default;

    gainNode.connect(audioContext.destination);
    const lastFilter = biquadFilters.reduce((destination, biquadFilter) => {
      biquadFilter.connect(destination);
      return biquadFilter;
    }, gainNode);
    source.connect(lastFilter);

    audioContext.resume()
    return () => {
      audioContext.destination.disconnect();
      gainNode.disconnect();
      source.disconnect();
      biquadFilters.forEach((biquadFilter) => biquadFilter.disconnect());
    };
  }, [stream, biquadFilters]);
  return useReducer((_: number, gain: number) => (gainNode.gain.value = gain), gainNode.gain.value);
};
