const estado = {

empresa:{},

notas:[],

produtos:[],

participantes:[]

};



const $ = id => document.getElementById(id);



document.querySelectorAll(".sidebar button")
.forEach(btn=>{

btn.onclick=()=>{


document.querySelectorAll(".page")
.forEach(p=>p.classList.add("hidden"));


$(btn.dataset.page)
.classList.remove("hidden");


};


});





$("btnAnalise").onclick=()=>{


const file=$("inputSped").files[0];


if(!file){

alert("Selecione um SPED");

return;

}



const reader=new FileReader();



reader.onload=e=>{


processarSPED(e.target.result);


render();


};



reader.readAsText(file);


};







function numero(valor){


if(!valor)return 0;


return Number(
valor.replace(/\./g,"")
.replace(",",".")
);

}




function processarSPED(texto){


estado.empresa={};

estado.notas=[];

estado.produtos=[];

estado.participantes=[];



texto.split(/\r?\n/)

.forEach(linha=>{


const c=linha.split("|");


const r=c[1];



switch(r){



case "0000":

estado.empresa={

razao:c[6]||"",

cnpj:c[7]||""

};

break;




case "0150":

estado.participantes.push({

nome:c[3]||""

});

break;





case "0200":

estado.produtos.push({

codigo:c[2]||"",

descricao:c[3]||"",

ncm:c[8]||""

});


break;





case "C100":


estado.notas.push({

numero:c[8]||"",

serie:c[7]||"",

data:c[10]||"",

valor:numero(c[12]),

chave:c[9]||""

});


break;



}



});


}





function render(){



$("status").innerHTML="SPED analisado com sucesso";



$("totalNotas").innerHTML=estado.notas.length;

$("totalProdutos").innerHTML=estado.produtos.length;

$("totalPart").innerHTML=estado.participantes.length;



let total=
estado.notas.reduce((a,b)=>a+b.valor,0);



$("valorTotal").innerHTML=

"R$ "+total.toLocaleString("pt-BR");





$("empresaDados").innerHTML=

`

<h3>${estado.empresa.razao}</h3>

CNPJ:
${estado.empresa.cnpj}

`;




renderNotas();

renderProdutos();



$("resumo").innerHTML=

`

Notas encontradas: ${estado.notas.length}

<br>

Produtos encontrados: ${estado.produtos.length}

<br>

Participantes: ${estado.participantes.length}

`;



}




function renderNotas(lista=estado.notas){


$("listaNotas").innerHTML="";


lista.forEach(n=>{


$("listaNotas").innerHTML+=`

<tr>

<td>${n.numero}</td>

<td>${n.serie}</td>

<td>${n.data}</td>

<td>R$ ${n.valor}</td>

<td>${n.chave}</td>

<td>

<button onclick='abrirNota(${JSON.stringify(n)})'>
Ver
</button>

</td>


</tr>`;


});


}






function renderProdutos(lista=estado.produtos){


$("listaProdutos").innerHTML="";


lista.forEach(p=>{


$("listaProdutos").innerHTML+=`

<tr>

<td>${p.codigo}</td>

<td>${p.descricao}</td>

<td>${p.ncm}</td>

</tr>

`;

});


}






document.querySelectorAll("input")
.forEach(input=>{


input.onkeyup=()=>{


renderNotas(
estado.notas.filter(n=>

n.numero.includes($("fNum").value)

)

);


};


});







function abrirNota(n){


$("modal").style.display="flex";


$("modalTexto").innerHTML=

`

NF: ${n.numero}

<br>

Data: ${n.data}

<br>

Valor:
R$ ${n.valor}

<br>

Chave:
${n.chave}

`;

}




$("fecharModal").onclick=()=>{

$("modal").style.display="none";

};