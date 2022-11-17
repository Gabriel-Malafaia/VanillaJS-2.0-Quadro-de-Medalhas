export class Api {
    static baseUrl = `https://kenzie-olympics.herokuapp.com/paises`
    static headers = {
        "Content-Type": "application/json"
    }

    static async infoPaises() {
        const options = {
            method: "GET",
            headers: this.headers
        }
        const paises = await fetch(this.baseUrl, options)
        const dataPaises = paises.json()
        return dataPaises
    }
}