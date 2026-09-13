import type {
  CreateCharacterInput,
  UpdateCharacterInput,
  CharacterListResponse,
  CharacterOwnerResponse,
} from "./schemas";

// ponytail: lean fetch wrapper, no axios/query libraries needed

export async function getCharacters(): Promise<CharacterListResponse> {
  const res = await fetch("/api/characters");
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function createCharacter(
  input: CreateCharacterInput,
): Promise<CharacterOwnerResponse> {
  const res = await fetch("/api/characters", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function updateCharacter(
  id: string,
  input: UpdateCharacterInput,
): Promise<CharacterOwnerResponse> {
  const res = await fetch(`/api/characters/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function deleteCharacter(id: string): Promise<void> {
  const res = await fetch(`/api/characters/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
}
