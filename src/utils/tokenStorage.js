const ACCESS_KEY  = "sb_access_token";
const REFRESH_KEY = "sb_refresh_token";

export const tokenStorage = {
  get() {
    return {
      access:  localStorage.getItem(ACCESS_KEY),
      refresh: localStorage.getItem(REFRESH_KEY),
    };
  },
  set(access, refresh) {
    localStorage.setItem(ACCESS_KEY,  access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};
