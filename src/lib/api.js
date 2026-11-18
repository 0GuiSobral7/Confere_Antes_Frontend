import { request } from "./http.js";

/*
 * Contrato real do back-end (Spring Boot, Configs/):
 *   POST /auth/login               {email, password}                 -> {token, type}
 *   POST /users                    {username, email, phone?, password} -> UserResponse
 *   GET  /users/me                                                    -> {id, username, email, phone, createdAt}
 *   POST /alerts                   {contactChannel, contactValue?}    -> {id, contactChannel, contactValue, overallRiskScore, createdAt}
 *   GET  /alerts/{id}/messages                                        -> [{id, content, sender, source, createdAt}]
 *   POST /alerts/{id}/messages     {content, sender: USUARIO|CONTATO} -> MessageResponse
 */
export const authApi = {
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password }, auth: false }),
};

export const usersApi = {
  register: ({ username, email, phone, password }) =>
    request("/users", { method: "POST", body: { username, email, phone: phone || undefined, password }, auth: false }),
  me: () => request("/users/me"),
};

export const alertsApi = {
  create: (contactChannel, contactValue) =>
    request("/alerts", { method: "POST", body: { contactChannel, contactValue: contactValue || undefined } }),
  messages: (alertId) => request(`/alerts/${alertId}/messages`),
  sendMessage: (alertId, content, sender = "USUARIO") =>
    request(`/alerts/${alertId}/messages`, { method: "POST", body: { content, sender } }),
};
