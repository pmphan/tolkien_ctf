import jwtDecode from "jwt-decode"
import * as moment from "moment"
import axios from "axios"

function localStorageTokenInterceptor(config) {
  let headers = {}
  const tokenString = localStorage.getItem("token")

  if (tokenString) {
    const token = JSON.parse(tokenString)
    const decodedAccessToken = jwtDecode(token.access_token)
    const isAccessTokenValid =
      moment.unix(decodedAccessToken.exp).toDate() > new Date()
    if (isAccessTokenValid) {
      headers["Authorization"] = `Bearer ${token.access_token}`
    }
  }
  config["headers"] = headers
  return config;
}

export class AuthenClient {
  constructor() {
    this.apiClient = this.getApiClient();
  }

  getApiClient(config) {
    let initialConfig = { baseURL: "/api/v1", timeout: 5000 }
    let client = axios.create(initialConfig);
    client.interceptors.request.use(localStorageTokenInterceptor);
    return client;
  }

  async signup(data) {
    return await this.apiClient
      .post("/signup", data)
      .then((resp) => {
        localStorage.setItem("token", JSON.stringify(resp.data));
      });
  }

  async login(data) {
    const params = new URLSearchParams();
    let to_add = {
      "grant_type": "password",
      "username": data["email"],
      "password": data["password"]
    }
    for (var key in to_add) {
      params.append(key, to_add[key]);
    }
    return await this.apiClient
      .post("/login", params)
      .then((resp) => {
        localStorage.setItem("token", JSON.stringify(resp.data));
      });
  }

  async fetchUser() {
    return await this.apiClient
      .get("/profile")
      .then(({data}) => {
        localStorage.setItem("user", JSON.stringify(data));
        return data
    })
  }

  async sendAnswer(data) {
    return await this.apiClient.post("/riddle", data);
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
}

const authenClient = new AuthenClient();
export default authenClient;
