// Authentication removed. useAuth is now a stub.
export function useAuth() {
  return {
    user: undefined,
    isLoading: false,
    isAuthenticated: false,
  };
}
