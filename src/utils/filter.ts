import { useEffect } from "react";

export const audioContext = new AudioContext({ sampleRate: 5000 });
export const gainNode = audioContext.createGain();
gainNode.gain.value = 0;
export const analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
analyser.maxDecibels = -30;
analyser.minDecibels = -200;
console.log(analyser.maxDecibels)
console.log(analyser.minDecibels)

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

    gainNode.connect(analyser);
    const lastFilter = biquadFilters.reduce((destination, biquadFilter) => {
      biquadFilter.connect(destination);
      return biquadFilter;
    }, gainNode);
    source.connect(lastFilter);
    analyser.connect(audioContext.destination);

    audioContext.resume();
    return () => {
      audioContext.destination.disconnect();
      gainNode.disconnect();
      source.disconnect();
      analyser.disconnect();
      biquadFilters.forEach((biquadFilter) => biquadFilter.disconnect());
    };
  }, [stream, biquadFilters]);
};
