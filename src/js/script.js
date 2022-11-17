import { Api } from "./api.js"

let paises = await Api.infoPaises()

let dadosPaises = paises.sort((a,b) => b.medal_gold - a.medal_gold).sort((a,b) => {
    return (b.medal_bronze + b.medal_silver + b.medal_gold) - (a.medal_bronze + a.medal_silver + a.medal_gold)
})

class script {
    static containerTable = document.querySelector(".container__table")
    static contentTable   = document.querySelector(".table__body--content")
    static arrowDown = `fa-solid fa-arrow-down-short-wide`
    static arrowUp = `fa-solid fa-arrow-up-short-wide`
    
    static criarLinhaTabela(data) {
        data.forEach((pais,index,array) => {
            const {country,flag_url,medal_bronze,medal_gold,medal_silver} = pais
            const tableBodyContainer = document.createElement("li")
            const tableBodyPosicao   = document.createElement("div")
            const tableBodyPais      = document.createElement("div")
            const tableBodyOuro      = document.createElement("div")
            const tableBodyPrata     = document.createElement("div")
            const tableBodyBronze    = document.createElement("div")
            const tableBodyTotal     = document.createElement("div")

            const posicaoH2 = document.createElement("h2")
            const paisImg   = document.createElement("img")
            const paisH3    = document.createElement("h3")
            const ouroH2    = document.createElement("h2")
            const prataH2   = document.createElement("h2")
            const bronzeH2  = document.createElement("h2")
            const totalH3   = document.createElement("h3")

            tableBodyContainer.classList.add("table__body")

            tableBodyPosicao.classList.add("table__button","body__button")

            if(array[0].medal_gold <= 5) {
                posicaoH2.innerText = array.length-index
            } else {
                posicaoH2.innerText = index+1
            }

            tableBodyPosicao.appendChild(posicaoH2)

            tableBodyPais.classList.add("table__country","body__country")
            paisImg.src = flag_url
            paisImg.alt = `${country} flag image`
            paisH3.innerText = country
            tableBodyPais.append(paisImg,paisH3)

            tableBodyOuro.classList.add("table__button","body__button")
            ouroH2.innerText = medal_gold
            tableBodyOuro.appendChild(ouroH2)

            tableBodyPrata.classList.add("table__button","body__button")
            prataH2.innerText = medal_silver
            tableBodyPrata.appendChild(prataH2)

            tableBodyBronze.classList.add("table__button","body__button")
            bronzeH2.innerText = medal_bronze
            tableBodyBronze.appendChild(bronzeH2)
        
            tableBodyTotal.classList.add("table__normal", "body__button")
            totalH3.innerText = `${parseInt(medal_bronze + medal_gold + medal_silver)}`
            tableBodyTotal.appendChild(totalH3)
            
            tableBodyContainer.append(tableBodyPosicao,tableBodyPais,tableBodyOuro,tableBodyPrata,tableBodyBronze,tableBodyTotal)
            this.contentTable.appendChild(tableBodyContainer)
        })
    }

    static async verificarIcone(element) {
        if(element.className == this.arrowDown) {
            element.className = this.arrowUp
            return true
        } else {
            element.className = this.arrowDown
            return false
        }
    }

    static async sortearTabela() {
        this.containerTable.addEventListener("click", async (e) => {
            const element = e.target
            const idLocal = e.target.id
            const sortearPosicao = idLocal == "sorterPosition"
            const sortearOuro    = idLocal == "sorterGold"
            const sortearPrata   = idLocal == "sorterSilver"
            const sortearBronze  = idLocal == "sorterBronze"

            if(sortearPosicao || sortearOuro || sortearPrata || sortearBronze) {
                const posicao = document.getElementById("sorterPosition")
                const ouro    = document.getElementById("sorterGold")
                const prata   = document.getElementById("sorterSilver")
                const bronze  = document.getElementById("sorterBronze")
                const arrayElementos = [posicao,ouro,prata,bronze]
                arrayElementos.forEach(element => {
                    if(element.id !== idLocal) {
                        element.className = this.arrowDown
                        element.style.color = '#fff'
                    } else {
                        element.style.color = 'red'
                    }
                })
                this.contentTable.innerHTML = ""
            }

            if(sortearPosicao) {
                if(await this.verificarIcone(element)) {
                    const transform = paises.sort((a,b) => b.medal_gold - a.medal_gold)
                    const newArr = transform.sort((a,b) => {
                        return (b.medal_bronze + b.medal_silver + b.medal_gold) - (a.medal_bronze + a.medal_silver + a.medal_gold)
                    })
                    script.criarLinhaTabela(newArr)
                } else {
                    const transform = paises.sort((a,b) => a.medal_gold - b.medal_gold)
                    const newArr = transform.sort((a,b) => {
                        return (a.medal_bronze + a.medal_silver + a.medal_gold) - (b.medal_bronze + b.medal_silver + b.medal_gold)
                    })
                    script.criarLinhaTabela(newArr)
                }
            } else if(sortearOuro) {
                if(await this.verificarIcone(element)) {
                    const newArr = dadosPaises.sort((a,b) => b.medal_gold - a.medal_gold)
                    script.criarLinhaTabela(newArr)
                } else {
                    const newArr = dadosPaises.sort((a,b) => a.medal_gold - b.medal_gold)
                    script.criarLinhaTabela(newArr)
                }
            } else if(sortearPrata) {
                if(await this.verificarIcone(element)) {
                    const newArr = dadosPaises.sort((a,b) => b.medal_silver - a.medal_silver)
                    script.criarLinhaTabela(newArr)
                } else {
                    const newArr = dadosPaises.sort((a,b) => a.medal_silver - b.medal_silver)
                    script.criarLinhaTabela(newArr)
                }
            } else if(sortearBronze) {
                if(await this.verificarIcone(element)) {
                    const newArr = dadosPaises.sort((a,b) => b.medal_bronze - a.medal_bronze)
                    script.criarLinhaTabela(newArr)
                } else {
                    const newArr = dadosPaises.sort((a,b) => a.medal_bronze - b.medal_bronze)
                    script.criarLinhaTabela(newArr)
                }
            }

        })
    }

    static pesquisarPaises() {
        const formPesquisa = document.querySelector(".subHeader__form")
        formPesquisa.addEventListener("submit", async (e) => {
            e.preventDefault()
            const valorInput = e.target[0].value.trim().toLowerCase()
            dadosPaises = await paises.filter(pais => pais.country.toLowerCase().trim().includes(valorInput))
            if(dadosPaises.length <= 0) {
                swal({
                    title: "País não encontrado!!",
                    text: "Iremos te redirecionar à pagina principal.",
                    icon: "error",
                    dangerMode: true
                  });
                setInterval( () => {
                    return location.reload()
                },2500)
            }
            this.contentTable.innerHTML = ""
            script.criarLinhaTabela(dadosPaises)
        })
    }
}

script.criarLinhaTabela(dadosPaises)
script.sortearTabela()
script.pesquisarPaises()
