
/* ===============================
   DADOS DOS EVENTOS
================================*/

const eventos = [
{
id:1,
titulo:"Workshop de Programação Web",
centro:"CCNT",
data:"10/08/2025",
local:"Auditório CCNT",
imagem:"images/evento1.png",
descricao:"Aprenda fundamentos de HTML, CSS e JavaScript."
},

{
id:2,
titulo:"Seminário de Saúde Coletiva",
centro:"CCBS",
data:"15/08/2025",
local:"Sala 12 - CCBS",
imagem:"images/evento2.jpg",
descricao:"Discussão sobre políticas públicas e saúde."
},

{
id:3,
titulo:"Palestra Educação e Tecnologia",
centro:"CCSE",
data:"20/08/2025",
local:"Auditório CCSE",
imagem:"images/evento3.png",
descricao:"Impacto da tecnologia nos métodos de ensino."
},
{
id:4,
titulo:"Mostra Científica UEPA",
centro:"CCNT",
data:"25/08/2025",
local:"Hall Central",
imagem:"images/evento4.png",
descricao:"Apresentação de projetos científicos dos alunos."
}
]

let filtroAtual = "todos"


/* ===============================
   GERAR CARDS
================================*/

function renderEventos(lista){

const container = document.getElementById("next-events")
const semResultados = document.getElementById("sem-resultados")

container.innerHTML = ""

if(lista.length === 0){
semResultados.style.display = "block"
return
}

semResultados.style.display = "none"

lista.forEach(evento=>{

const card = document.createElement("div")
card.className = "evento-card"

card.innerHTML = `
<img src="${evento.imagem}" class="evento-img">

<div class="evento-info">

<h3>${evento.titulo}</h3>

<p><strong>Centro:</strong> ${evento.centro}</p>
<p><strong>Data:</strong> ${evento.data}</p>
<p><strong>Local:</strong> ${evento.local}</p>

<button class="btn-inscrever" data-id="${evento.id}">
Inscrever-se
</button>

</div>
`

container.appendChild(card)

})

}


/* ===============================
   FILTRO POR CENTRO
================================*/

function aplicarFiltro(){

const busca = document.getElementById("search-input").value.toLowerCase()

let lista = eventos

if(filtroAtual !== "todos"){
lista = lista.filter(e=>e.centro===filtroAtual)
}

if(busca){
lista = lista.filter(e=>e.titulo.toLowerCase().includes(busca))
}

renderEventos(lista)

}


/* ===============================
   BOTÕES DE FILTRO
================================*/

document.querySelectorAll(".filtro-btn").forEach(btn=>{

btn.addEventListener("click",()=>{

document.querySelectorAll(".filtro-btn").forEach(b=>b.classList.remove("active"))

btn.classList.add("active")

filtroAtual = btn.dataset.centro

aplicarFiltro()

})

})


/* ===============================
   CARDS DE CENTRO
================================*/

document.querySelectorAll(".uepa-div").forEach(card=>{

card.addEventListener("click",()=>{

filtroAtual = card.dataset.centro

document.getElementById("proximos-eventos").scrollIntoView({behavior:"smooth"})

aplicarFiltro()

})

})


/* ===============================
   BUSCA
================================*/

document.getElementById("search-input").addEventListener("input",()=>{

aplicarFiltro()

})


/* ===============================
   MODAL
================================*/

const overlay = document.getElementById("modal-overlay")
const modalTitulo = document.getElementById("modal-titulo-evento")
const modalInfo = document.getElementById("modal-info-evento")

document.addEventListener("click",function(e){

if(e.target.classList.contains("btn-inscrever")){

const id = Number(e.target.dataset.id)

const evento = eventos.find(ev=>ev.id===id)

modalTitulo.textContent = evento.titulo
modalInfo.textContent = `${evento.data} • ${evento.local}`

overlay.classList.remove("hidden")

}

})


document.getElementById("modal-fechar").onclick=()=>{
overlay.classList.add("hidden")
}

overlay.addEventListener("click",(e)=>{
if(e.target===overlay){
overlay.classList.add("hidden")
}
})


/* ===============================
   FORMULÁRIO
================================*/

const form = document.getElementById("form-inscricao")

form.addEventListener("submit",(e)=>{

e.preventDefault()

const nome = document.getElementById("campo-nome")
const email = document.getElementById("campo-email")
const curso = document.getElementById("campo-curso")
const matricula = document.getElementById("campo-matricula")

let valido = true

function erro(campo,msg,id){

const el = document.getElementById(id)

if(!campo.value.trim()){
el.textContent = msg
valido=false
}else{
el.textContent=""
}

}

erro(nome,"Informe seu nome","erro-nome")
erro(email,"Informe seu email","erro-email")
erro(curso,"Informe seu curso","erro-curso")
erro(matricula,"Informe matrícula","erro-matricula")

if(!valido) return


const inscricao = {
nome:nome.value,
email:email.value,
curso:curso.value,
matricula:matricula.value,
evento:modalTitulo.textContent
}

let inscritos = JSON.parse(localStorage.getItem("inscricoes")) || []

inscritos.push(inscricao)

localStorage.setItem("inscricoes",JSON.stringify(inscritos))


document.getElementById("modal-form-view").classList.add("hidden")
document.getElementById("modal-sucesso-view").classList.remove("hidden")

document.getElementById("sucesso-mensagem").textContent =
`Sua vaga no evento "${inscricao.evento}" foi confirmada.`

})


/* ===============================
   FECHAR TELA DE SUCESSO
================================*/

document.getElementById("btn-fechar-sucesso").onclick=()=>{

overlay.classList.add("hidden")

document.getElementById("modal-form-view").classList.remove("hidden")
document.getElementById("modal-sucesso-view").classList.add("hidden")

form.reset()

}


/* ===============================
   INICIALIZAÇÃO
================================*/

renderEventos(eventos)


