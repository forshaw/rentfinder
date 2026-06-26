export async function createRequest(
  data: {
    location: string;
    budget: number;
    property_type: string;
  },
  token: string
) {
  const res = await fetch("http://localhost:3000/api/requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create request");
  }

  return res.json();
}
export async function fetchMyRequests() {
  const raw = localStorage.getItem("rentfinder_auth");
  const token = raw ? JSON.parse(raw).token : null;

  const res = await fetch(
    "http://localhost:3000/api/requests/my-requests",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch requests");
  }

  return res.json();
}

