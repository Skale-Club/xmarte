import { create } from 'zustand';
import { TapoCameraConfig } from '@/lib/tapo-stream';

interface CameraStore {
  cameras: TapoCameraConfig[];
  addCamera: (camera: TapoCameraConfig) => void;
  removeCamera: (id: string) => void;
  updateCamera: (id: string, updates: Partial<TapoCameraConfig>) => void;
  getCamera: (id: string) => TapoCameraConfig | undefined;
  loadCameras: () => void;
}

// Helper functions for localStorage
const STORAGE_KEY = 'tapo-cameras';

const loadFromStorage = (): TapoCameraConfig[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading cameras from storage:', error);
    return [];
  }
};

const saveToStorage = (cameras: TapoCameraConfig[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cameras));
  } catch (error) {
    console.error('Error saving cameras to storage:', error);
  }
};

export const useCameraStore = create<CameraStore>((set, get) => ({
  cameras: [],

  loadCameras: () => {
    const cameras = loadFromStorage();
    set({ cameras });
  },

  addCamera: (camera) => {
    set((state) => {
      const newCameras = [...state.cameras, camera];
      saveToStorage(newCameras);
      return { cameras: newCameras };
    });
  },

  removeCamera: (id) => {
    set((state) => {
      const newCameras = state.cameras.filter((cam) => cam.id !== id);
      saveToStorage(newCameras);
      return { cameras: newCameras };
    });
  },

  updateCamera: (id, updates) => {
    set((state) => {
      const newCameras = state.cameras.map((cam) =>
        cam.id === id ? { ...cam, ...updates } : cam
      );
      saveToStorage(newCameras);
      return { cameras: newCameras };
    });
  },

  getCamera: (id) => {
    return get().cameras.find((cam) => cam.id === id);
  },
}));
