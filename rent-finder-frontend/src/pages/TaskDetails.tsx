import { useParams } from "react-router-dom";

export default function TaskDetails() {
  const { id } = useParams();

  return (
    <div style={{ padding: 24 }}>
      <h2>Task Details</h2>

      <p>Task ID: <strong>{id}</strong></p>

      <p>This will later show full task information.</p>
    </div>
  );
}