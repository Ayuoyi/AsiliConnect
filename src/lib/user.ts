// Small helper to centralize how we read the user's display name.
// Currently reads from localStorage and falls back to generic labels.
export function getUserName(): string {
  if (typeof window === "undefined") return "User";
  return (
    localStorage.getItem("farmerName") ||
    localStorage.getItem("userName") ||
    localStorage.getItem("buyerName") ||
    "User"
  );
}

export function getFarmerName(): string {
  if (typeof window === "undefined") return "Farmer";
  return localStorage.getItem("farmerName") || getUserName() || "Farmer";
}
