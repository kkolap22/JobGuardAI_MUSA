// Set `window.JOBGUARD_API_BASE_URL` before this module loads when the API is
// hosted elsewhere. Local development continues to use the backend default.
const API_BASE_URL = (
  window.JOBGUARD_API_BASE_URL || "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

const STORAGE_KEYS = {
  ACCESS_TOKEN: "jobguard_access_token",
  REFRESH_TOKEN: "jobguard_refresh_token",
  USER: "jobguard_user",
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

export const api = {
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken() {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  getUser() {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  setAuthSession(tokens, user) {
    if (tokens?.accessToken) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    }
    if (tokens?.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    }
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  },

  clearAuthSession() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    const token = this.getToken();
    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    let response;
    try {
      response = await fetch(url, config);
    } catch (networkErr) {
      throw new Error(
        "Cannot connect to JobGuard backend server. Please make sure the backend is running at http://localhost:5000.",
      );
    }

    if (
      response.status === 401 &&
      this.getRefreshToken() &&
      !endpoint.includes("/auth/")
    ) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        headers["Authorization"] = `Bearer ${this.getToken()}`;
        response = await fetch(url, { ...config, headers });
      } else {
        this.clearAuthSession();
        window.location.href = "login.html";
        throw new Error("Session expired. Please log in again.");
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        data.message ||
        (data.errors ? Object.values(data.errors).flat().join(", ") : null) ||
        `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  },

  async register(name, email, password) {
    const data = await this.request("/auth/register", {
      method: "POST",
      body: { name, email, password },
    });

    if (data.data?.tokens && data.data?.user) {
      this.setAuthSession(data.data.tokens, data.data.user);
    }
    return data;
  },

  async login(email, password) {
    const data = await this.request("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    if (data.data?.tokens && data.data?.user) {
      this.setAuthSession(data.data.tokens, data.data.user);
    }
    return data;
  },

  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const data = await this.request("/auth/refresh", {
        method: "POST",
        body: { refreshToken },
      });

      const tokens = data.data?.tokens;
      if (tokens?.accessToken) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
        if (tokens.refreshToken) {
          localStorage.setItem(
            STORAGE_KEYS.REFRESH_TOKEN,
            tokens.refreshToken,
          );
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  async logout() {
    try {
      await this.request("/auth/logout", {
        method: "POST",
      });
    } catch (e) {
      console.warn("Logout request error:", e);
    } finally {
      this.clearAuthSession();
      window.location.href = "login.html";
    }
  },

  async getMe() {
    return this.request("/auth/me", { method: "GET" });
  },

  async createScan(jobUrl) {
    return this.request("/scans", {
      method: "POST",
      body: { jobUrl },
    });
  },

  async getScan(scanId) {
    return this.request(`/scans/${encodeURIComponent(scanId)}`, {
      method: "GET",
    });
  },

  async getUserScans() {
    return this.request("/scans", {
      method: "GET",
    });
  },

  async getReport(scanId) {
    return this.request(`/reports/${encodeURIComponent(scanId)}`, {
      method: "GET",
    });
  },

  async getScanEvents(scanId) {
    return this.request(`/scans/${encodeURIComponent(scanId)}/events`, {
      method: "GET",
    });
  },

  async getScanFindings(scanId) {
    return this.request(`/scans/${encodeURIComponent(scanId)}/findings`, {
      method: "GET",
    });
  },

  async analyzeWithAI(scanId) {
    return this.request(`/ai/analyze/${encodeURIComponent(scanId)}`, {
      method: "POST",
    });
  },

  updateNavbar() {
    const navActions = document.querySelector(".nav-actions");
    if (!navActions) return;

    if (this.isAuthenticated()) {
      const user = this.getUser();
      const displayName = user?.name ? user.name.split(" ")[0] : "Account";

      navActions.innerHTML = `
        <span style="font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 700; color: #08ad50; display: inline-flex; align-items: center; gap: 5px;">
          <span class="material-symbols-rounded" style="font-size: 19px;">account_circle</span>
          Hi, ${escapeHtml(displayName)}
        </span>
        <button id="logoutBtn" style="padding: 10px 16px; border-radius: 9px; font-family: 'Space Grotesk', Inter, sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; border: 1px solid #e4e7ec; background: white; color: #344054; transition: 0.25s;" onmouseover="this.style.borderColor='#08ad50'; this.style.color='#08ad50';" onmouseout="this.style.borderColor='#e4e7ec'; this.style.color='#344054';">
          Logout
        </button>
      `;

      document.getElementById("logoutBtn")?.addEventListener("click", () => {
        this.logout();
      });
    } else {
      navActions.innerHTML = `
        <a href="login.html" class="login">Login</a>
        <a href="signup.html" class="signup">Sign Up</a>
      `;
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  api.updateNavbar();
});
