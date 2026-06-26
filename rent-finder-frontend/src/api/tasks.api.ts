const API = "https://rentfinder-vxp1.onrender.com/api/tasks";

function getToken() {
  const raw = localStorage.getItem("rentfinder_auth");
  if (!raw) return null;
  return JSON.parse(raw).token;
}

/**
 * ✅ GET TASKS
 */
export async function fetchMyTasks() {
  const raw = localStorage.getItem("rentfinder_auth");
  const token = raw ? JSON.parse(raw).token : null;

  const res = await fetch("https://rentfinder-vxp1.onrender.com/api/tasks/busy", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return res.json();
}

/**
 * ✅ VERIFY TASK
 */
export async function verifyTask(taskId: number) {
  const raw = localStorage.getItem("rentfinder_auth");
  const token = raw ? JSON.parse(raw).token : null;

  const res = await fetch(
    `https://rentfinder-vxp1.onrender.com/api/tasks/${taskId}/verify`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to verify task");
  }

  return res.json();
}

/**
 * ✅ CANCEL ESCROW
 */
export async function cancelEscrow(escrowId: number) {
  const token = getToken();

  const res = await fetch(`${API}/${escrowId}/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Cancel failed");
}


export async function fetchAssignedTasks() {
  const raw = localStorage.getItem("rentfinder_auth");
  const token = raw ? JSON.parse(raw).token : null;

  const res = await fetch("https://rentfinder-vxp1.onrender.com/api/tasks/assigned", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch assigned tasks");
  }

  return res.json();
}

/**
 * ✅ FIXED PAY ESCROW (NOW ACCEPTS ID ✅)
 */
export async function payEscrow(escrowId: number) {
  const raw = localStorage.getItem("rentfinder_auth");
  const token = raw ? JSON.parse(raw).token : null;

  const res = await fetch(
    `https://rentfinder-vxp1.onrender.com/api/escrow/${escrowId}/fund`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Escrow fund failed:", text); // ✅ DEBUG
    throw new Error("Failed to fund escrow");
  }

  return res.json();
}
/**
 * ✅ COMPLETE TAS
 */
export async function completeTask(taskId: number) {
  const raw = localStorage.getItem("rentfinder_auth");
  const token = raw ? JSON.parse(raw).token : null;

  const res = await fetch(
    `https://rentfinder-vxp1.onrender.com/api/tasks/${taskId}/complete`,
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

  return res.json();
}
/**
 * ✅ SUBMIT PAYMENT PROOF
 */
export async function submitPaymentProof(
  escrowId: number,
  file: File
) {
  const raw = localStorage.getItem("rentfinder_auth");
  const token = raw ? JSON.parse(raw).token : null;

  const formData = new FormData();
  formData.append("proof", file);

  const res = await fetch(
    `https://rentfinder-vxp1.onrender.com/api/escrow/${escrowId}/proof`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  return res.json();
}



