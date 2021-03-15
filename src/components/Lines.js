import Line from "./Line";

function Lines({ lines }) {
    return (
      <svg className="painting" >
        {lines.map((line, index) => (
          <Line key={index} line={line} />
        ))}
      </svg>
    );
}
  
export default Lines;
