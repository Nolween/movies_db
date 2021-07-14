import axios from 'axios'

export default function () {
    // Variable de base si l'on est sur le dev ou la production
    process.env.VUE_APP_BASEURL
    const instance = axios.create({
        timeout: 20000,
        // Variable différente selon l'environnement (définie dans config/prod.env.js ou config/dev.env.js)
        baseURL: process.env.VUE_APP_BASEURL,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true"
        },
    })
    return instance
}
