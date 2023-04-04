import jwtDecode from "jwt-decode"
import * as moment from "moment"
import axios from "axios"

import { config } from "../config"

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
    } else {
      alert('Your login session has expired. Please login again.')
    }
  }
  config["headers"] = headers
  return config;
}

export class AuthenClient {
	constructor(config) {
		this.config = {
			...config
		}
		this.apiClient = this.getApiClient(this.config);
	}


  getApiClient(config) {
		let initialConfig = { baseURL: `http://${config.authenUrl}/v1/auth`, timeout: 5000 }
		let client = axios.create(initialConfig);
    client.interceptors.request.use(localStorageTokenInterceptor);
		return client;
	}

  async signup(data) {
    return await this.apiClient
      .post("/signup", data)
      .then((resp) => {
        localStorage.setItem("token", JSON.stringify(resp.data));
        return this.fetchUser();
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
        return this.fetchUser();
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

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
}

const authenClient = new AuthenClient(config);
export default authenClient;
