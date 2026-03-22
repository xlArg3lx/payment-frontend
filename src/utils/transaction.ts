export const translateStatus = (status: string | undefined): string => {
  const map: Record<string, string> = {
    APPROVED: "APROBADO",
    DECLINED: "RECHAZADO",
    PENDING: "PENDIENTE",
    ERROR: "ERROR",
  };
  return status ? (map[status] ?? status) : "";
};
