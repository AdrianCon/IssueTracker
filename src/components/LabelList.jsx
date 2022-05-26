import { useLabelsData } from "../helpers/useLabelsData";

export default function LabelList({selected, toggle}) {
  const labelsQuery = useLabelsData();
  return (
    <div className={"labels"}>
      {labelsQuery.isLoading ? <p>Loading...</p> : (
        <ul>
          {labelsQuery.data.map((label) => 
            <li key={label.id}>
              <button
                className={`label ${selected.includes(label.id) ? "selected " : ""} ${label.color}`}
                onClick={() => toggle(label.id)}
              >
                {label.name}
              </button>
            </li>
          )}
        </ul>
      )}
      <h3></h3>
    </div>
  );
}
