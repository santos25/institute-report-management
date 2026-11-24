export function childrenVisibleToGuardian<T extends { guardianId: string | null }>(
  guardianId: string,
  students: T[]
): T[] {
  if (!guardianId) return [];
  return students.filter((student) => student.guardianId === guardianId);
}
