import API from "../../../store/api";

export async function getZonas() {      
    return await API.get("Zonas")
}