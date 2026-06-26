const API = "http://localhost:3000/api/tasks";

function getToken() {
  const raw = localStorage.getItem("rentfinder_auth");
  if (!raw) return null;
  return JSON.parse(raw).token;
}

/**
 * ✅ FETCH ASSIGNED TASKS
 */
export async function fetchAssignedTasks() {
  const token = getToken();

  const res = await fetch(`${API}/assigned`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Fetch assigned tasks error:", text);
    throw new Error("Failed to fetch assigned tasks");
  }

  return res.json();
}

export async function fetchAvailableRequests() {
  const raw = localStorage.getItem("rentfinder_auth");
  const token = raw ? JSON.parse(raw).token : null;

  const res = await fetch("http://localhost:3000/api/requests", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch requests");
  }

  return res.json();
}

export async function acceptRequest(requestId: number) {
  const raw = localStorage.getItem("rentfinder_auth");
  const token = raw ? JSON.parse(raw).token : null;

  const res = await fetch(
    `http://localhost:3000/api/requests/${requestId}/accept`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to accept request");
  }

  return res.json();
}

export async function fetchMyTasks() {
  const raw = localStorage.getItem("rentfinder_auth");
  const token = raw ? JSON.parse(raw).token : null;

  const res = await fetch("http://localhost:3000/api/tasks/finder", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return res.json();
}

export async function completeTask(taskId: number) {
  const raw = localStorage.getItem("rentfinder_auth");
  const token = raw ? JSON.parse(raw).token : null;

  const res = await fetch(
    `http://localhost:3000/api/tasks/${taskId}/complete`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to complete task");
  }
}
export async function fetchRequestById(id: number) {
  const raw = localStorage.getItem("rentfinder_auth");
  const token = raw ? JSON.parse(raw).token : null;

  const res = await fetch(
    `http://localhost:3000/api/requests/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch request");
  }

  return res.json();
}
