const API_KEY = "32f8ac05c772f7eaaf53335575960277";
const BASE_URL = "https://api.themoviedb.org/3";
const DISCOVER_URL = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&sort_by=popularity.desc&page=`;
const SEARCH_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=`;
const IMG_URL = "https://image.tmdb.org/t/p/w500/";

let paginaAtual = 1;
let carregando = false; // Para evitar requisições duplicadas
let modoPesquisa = false; // Se estamos pesquisando ou não

// 🔍 Função para buscar filmes populares (inicial)
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

// 🔍 Função para buscar filmes conforme o usuário digita
async function pesquisarFilmes(termo) {
    if (termo.length === 0) {
        // Se o campo de pesquisa estiver vazio, volta para os filmes populares
        modoPesquisa = false;
        paginaAtual = 1;
        document.getElementById("resultados-pesquisa").innerHTML = "";
        buscarFilmes();
        return;
    }

    modoPesquisa = true; // Entramos no modo pesquisa

    try {
        const resposta = await fetch(SEARCH_URL + encodeURIComponent(termo));
        const dados = await resposta.json();

        mostrarFilmes(dados.results, true); // Mostra apenas os resultados da pesquisa
    } catch (erro) {
        console.error("Erro ao pesquisar filmes:", erro);
    }
}

// 🎬 Exibir os filmes na tela
function mostrarFilmes(filmes, limpar = false) {
    let section = document.getElementById("resultados-pesquisa");

    if (limpar) {
        section.innerHTML = ""; // Limpa os resultados ao pesquisar
    }

    filmes.forEach(filme => {
        let poster = filme.poster_path ? IMG_URL + filme.poster_path : "https://via.placeholder.com/500x400?text=Sem+Imagem";

        let resultado = `
            <div class="item-resultado">
                <img src="${poster}" alt="Pôster de ${filme.title}" class="poster-filme">
                <h2>
                    <a href="https://www.themoviedb.org/movie/${filme.id}" target="_blank">${filme.title}</a>
                </h2>
                <p class="descricao-meta">${filme.overview || "Descrição não disponível."}</p>
                <a href="https://www.themoviedb.org/movie/${filme.id}" target="_blank">Mais informações</a>
            </div>
        `;
        section.innerHTML += resultado;
    });
}

// 📌 Detectar rolagem para carregar mais filmes
function detectarRolagem() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        buscarFilmes();
    }
}

// 📝 Capturar digitação no campo de pesquisa
document.getElementById("campo-pesquisa").addEventListener("input", (event) => {
    pesquisarFilmes(event.target.value);
});

// 🚀 Iniciar com os primeiros filmes e ativar a rolagem infinita
buscarFilmes();
window.addEventListener("scroll", detectarRolagem);
