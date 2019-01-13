export const urlConstants = {
    BASE_URL: "https://localhost:8000"
};

export const API_INTERFACE = {
    LOGIN: "/users/me",
    CREATE_CLIENT: "/access-points"
}

export const uriConstants = {
    LOGIN: urlConstants.BASE_URL + API_INTERFACE.LOGIN,
    CREATE_CLIENT: urlConstants.BASE_URL + API_INTERFACE.CREATE_CLIENT
}