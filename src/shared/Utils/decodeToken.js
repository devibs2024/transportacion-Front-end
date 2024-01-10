export const tokenDecode = () => {
    const token = JSON.parse(localStorage.getItem("user")).token;
    const tokenPart = token.split('.');
    const encodePayload = tokenPart[1];

    const decodePayload = atob(encodePayload)
    const { Id } = JSON.parse(decodePayload);
    return Id;

}