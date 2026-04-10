import type { Pet } from '@/types/pet'

const PET_STORAGE_KEY = 'pet-todo-pet'

export function loadPet(): Pet | null {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(PET_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as Pet
  } catch (error) {
    console.error('Failed to load pet from localStorage', error)
    return null
  }
}

export function savePet(pet: Pet) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(PET_STORAGE_KEY, JSON.stringify(pet))
}