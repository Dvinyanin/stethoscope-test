import { useReducer } from "react";

interface Props {
  filter: BiquadFilterNode;
  onRemove: () => void;
}
const filterTypes = [
  "allpass",
  "bandpass",
  "highpass",
  "highshelf",
  "lowpass",
  "lowshelf",
  "notch",
  "peaking",
] as const;
const props = ["frequency", "Q", "gain"] as const;
const FilterCmponent = ({ filter, onRemove }: Props) => {
  const [, handleChange] = useReducer(
    (
      _: number,
      {
        prop,
        value,
      }: { prop: "frequency" | "Q" | "gain" | "type"; value: string }
    ) => {
      if (prop === "type") {
        filter.type = value as any;
      } else {
        filter[prop].value = Number(value);
      }
      return _ + 1;
    },
    0
  );
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ padding: 5 }}>
        type
        <select
          style={{ marginLeft: 5 }}
          onChange={({ target }) =>
            handleChange({ prop: "type", value: target.value })
          }
          value={filter.type}
        >
          {filterTypes.map((type) => (
            <option value={type} key={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      {props.map((prop) => (
        <div key={prop} style={{ padding: 5 }}>
          {prop}
          <input
            style={{ marginLeft: 5 }}
            type="number"
            value={filter[prop].value}
            onChange={({ target }) =>
              handleChange({ prop, value: target.value })
            }
          />
        </div>
      ))}
      <button onClick={onRemove}>Remove</button>
    </div>
  );
};

export default FilterCmponent;
