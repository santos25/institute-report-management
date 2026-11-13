"use client";

/**
 * Global Planillas autosave state manager
 * Tracks all pending, saving, invalid, and error states across the grid
 */

export interface CellState {
  value: string;
  status: "idle" | "editing" | "saving" | "saved" | "error" | "invalid";
  error?: string;
  retryCount: number;
}

export interface PlanillaState {
  gradoId: string;
  gradoName: string;
  periodoId: string;
  periodoName: string;
  areaId: string;
  areaName: string;
  cells: Record<string, CellState>;
  lastSaved: number;
}

export interface AffectedStudent {
  name: string;
  reason: "saving" | "invalid" | "error";
  value?: string;
}

let currentState: PlanillaState | null = null;
const stateListeners = new Set<() => void>();

/**
 * Initialize planilla state
 */
export function initPlanillaState(state: PlanillaState) {
  currentState = state;
  notifyListeners();
  saveDraft(state);
}

/**
 * Update cell state
 */
export function updateCellState(key: string, state: Partial<CellState>) {
  if (!currentState) return;
  
  currentState.cells[key] = {
    ...currentState.cells[key],
    ...state,
  };
  
  notifyListeners();
  saveDraft(currentState);
}

/**
 * Clear planilla state (after successful save or navigation away)
 */
export function clearPlanillaState() {
  currentState = null;
  notifyListeners();
  clearDraft();
}

/**
 * Get current planilla state
 */
export function getPlanillaState(): PlanillaState | null {
  return currentState;
}

/**
 * Check if there are unsaved changes
 */
export function hasUnsavedChanges(): {
  has: boolean;
  affectedStudents: AffectedStudent[];
  isSaving: boolean;
} {
  if (!currentState) {
    return { has: false, affectedStudents: [], isSaving: false };
  }

  const affectedStudents: AffectedStudent[] = [];
  let isSaving = false;

  // Group by student
  const studentMap = new Map<string, AffectedStudent>();

  Object.entries(currentState.cells).forEach(([key, state]) => {
    const [studentId] = key.split("-");
    
    if (state.status === "saving") {
      isSaving = true;
      if (!studentMap.has(studentId)) {
        // Get student name from first cell we see
        const studentName = getStudentNameFromKey(key);
        studentMap.set(studentId, {
          name: studentName,
          reason: "saving",
        });
      }
    } else if (state.status === "invalid") {
      if (!studentMap.has(studentId)) {
        const studentName = getStudentNameFromKey(key);
        studentMap.set(studentId, {
          name: studentName,
          reason: "invalid",
          value: state.value,
        });
      }
    } else if (state.status === "error") {
      if (!studentMap.has(studentId)) {
        const studentName = getStudentNameFromKey(key);
        studentMap.set(studentId, {
          name: studentName,
          reason: "error",
        });
      }
    }
  });

  return {
    has: studentMap.size > 0,
    affectedStudents: Array.from(studentMap.values()),
    isSaving,
  };
}

/**
 * Extract student name from cell key (stored in state)
 * For now we'll need to pass student names when initializing
 */
function getStudentNameFromKey(key: string): string {
  // This is a placeholder - we'll store student names in the state
  const [studentId] = key.split("-");
  return studentId; // Will be replaced with actual name
}

/**
 * Subscribe to state changes
 */
export function subscribeToPlanillaState(listener: () => void) {
  stateListeners.add(listener);
  return () => stateListeners.delete(listener);
}

function notifyListeners() {
  stateListeners.forEach((listener) => listener());
}

/**
 * Draft recovery: Save to sessionStorage
 */
function saveDraft(state: PlanillaState) {
  if (typeof window === "undefined") return;
  
  try {
    const key = `planilla-draft-${state.gradoId}-${state.periodoId}-${state.areaId}`;
    const draft = {
      ...state,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(key, JSON.stringify(draft));
  } catch (error) {
    console.error("Failed to save draft:", error);
  }
}

/**
 * Draft recovery: Load from sessionStorage
 */
export function loadDraft(
  gradoId: string,
  periodoId: string,
  areaId: string
): PlanillaState | null {
  if (typeof window === "undefined") return null;
  
  try {
    const key = `planilla-draft-${gradoId}-${periodoId}-${areaId}`;
    const stored = sessionStorage.getItem(key);
    if (!stored) return null;
    
    const draft = JSON.parse(stored);
    const age = Date.now() - draft.timestamp;
    const maxAge = 12 * 60 * 60 * 1000; // 12 hours
    
    if (age > maxAge) {
      // Draft too old, discard it
      sessionStorage.removeItem(key);
      return null;
    }
    
    return draft as PlanillaState;
  } catch (error) {
    console.error("Failed to load draft:", error);
    return null;
  }
}

/**
 * Draft recovery: Clear from sessionStorage
 */
function clearDraft() {
  if (typeof window === "undefined" || !currentState) return;
  
  try {
    const key = `planilla-draft-${currentState.gradoId}-${currentState.periodoId}-${currentState.areaId}`;
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to clear draft:", error);
  }
}

/**
 * Wait for in-flight saves to complete (up to 3 seconds)
 */
export async function waitForSaves(maxWaitMs: number = 3000): Promise<boolean> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitMs) {
    const { isSaving } = hasUnsavedChanges();
    if (!isSaving) return true;
    
    // Wait 100ms before checking again
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  
  return false; // Timeout - still saving
}
