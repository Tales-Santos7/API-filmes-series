const API_KEY = "32f8ac05c772f7eaaf53335575960277";
const BASE_URL = "https://api.themoviedb.org/3";
const DISCOVER_URL = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&sort_by=popularity.desc&page=`;
const SEARCH_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=`;
const IMG_URL = "https://image.tmdb.org/t/p/w500/";

let paginaAtual = 1;
let carregando = false;
let modoPesquisa = false;

async function buscarFilmes() {
    if (carregando || modoPesquisa) return;
    carregando = true;

    try {
        const resposta = await fetch(DISCOVER_URL + paginaAtual);
        const dados = await resposta.json();

        if (dados.results.length > 0) {
            mostrarFilmes(dados.results, false);
            paginaAtual++;
        } else {
            console.log("🚀 Todos os filmes foram carregados!");
            window.removeEventListener("scroll", detectarRolagem);
        }
    } catch (erro) {
        console.error("Erro ao buscar filmes:", erro);
    }

    carregando = false;
}

async function pesquisarFilmes(termo) {
    if (termo.length === 0) {
        modoPesquisa = false;
        paginaAtual = 1;
        document.getElementById("resultados-pesquisa").innerHTML = "";
        buscarFilmes();
        return;
    }

    modoPesquisa = true;

    try {
        const resposta = await fetch(SEARCH_URL + encodeURIComponent(termo));
        const dados = await resposta.json();

        mostrarFilmes(dados.results, true);
    } catch (erro) {
        console.error("Erro ao pesquisar filmes:", erro);
    }
}

function mostrarFilmes(filmes, limpar = false) {
    let section = document.getElementById("resultados-pesquisa");

    if (limpar) {
        section.innerHTML = "";
    }

    filmes.forEach(filme => {
        let poster = filme.poster_path ? IMG_URL + filme.poster_path : "https://via.placeholder.com/500x400?text=Sem+Imagem";
        let descricao = filme.overview && filme.overview.trim() !== "" ? filme.overview : "Nenhuma descrição disponível para este filme.";

        let resultado = `
            <div class="item-resultado">
                <img src="${poster}" alt="Pôster de ${filme.title}" class="poster-filme">
                <h2>
                    <a href="https://www.themoviedb.org/movie/${filme.id}" target="_blank">${filme.title}</a>
                </h2>
                <p class="descricao-meta">${descricao}</p>
                <a href="https://www.themoviedb.org/movie/${filme.id}" target="_blank">Mais informações</a>
            </div>
        `;
        section.innerHTML += resultado;
    });
}

function detectarRolagem() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        buscarFilmes();
    }
}

document.getElementById("campo-pesquisa").addEventListener("input", (event) => {
    pesquisarFilmes(event.target.value);
});

buscarFilmes();
window.addEventListener("scroll", detectarRolagem);
