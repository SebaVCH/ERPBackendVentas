import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

type SessionState = {
  accessToken?: string
  clientId?: string
  name?: string

  setAccessToken: (token?: string) => void
  setClientId: (id?: string) => void
  setName: (name?: string) => void

  clearSession: () => void
}

const useSessionStore = create<SessionState>()(
  devtools(
    persist(
      (set) => ({
        accessToken: undefined,
        clientId: undefined,
        name: undefined,

        setAccessToken: (accessToken) => set({ accessToken }),
        setClientId: (clientId) => set({ clientId }),
        setName: (name) => set({ name }),

        clearSession: () =>
          set({
            accessToken: undefined,
            clientId: undefined,
            name: undefined,
          }),
      }),
      {
        name: "session-store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

export default useSessionStore
