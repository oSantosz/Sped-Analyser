let sped={

empresa:{},

notas:[],

produtos:[],

participantes:[]

};



function aba(nome){


document.querySelectorAll(".page")
.forEach(x=>x.classList.add("hidden"));


document.getElementById(nome)
.classList.remove("hidden");


}




function consultar(){


let file=
document.getElementById("arquivo").files[0];


if(!file){

alert("Selecione um SPED");

return;

}



let reader=new FileReader();



reader.onload=e=>{

lerSPED(e.target.result);

mostrar();

};


reader.readAsText(file);



}




function lerSPED(txt){

sped={

empresa:{},

notas:[],

produtos:[],

participantes:[],

icms:0

};


txt.split(/\r?\n/).forEach(l=>{


let c=l.split("|");

let r=c[1];



if(!r) return;



// EMPRESA
if(r=="0000"){


sped.empresa={

razao:c[6],
cnpj:c[7],
inicio:c[4],
fim:c[5]

};


}



// PARTICIPANTES
if(r=="0150"){


sped.participantes.push({

codigo:c[2],
nome:c[3]

});


}



// PRODUTOS
if(r=="0200"){


sped.produtos.push({

codigo:c[2],
descricao:c[3],
ncm:c[8]

});


}



// NOTAS C100

if(r=="C100"){



let valor =
converterValor(c[12]);



let icms =
converterValor(c[22]);



sped.notas.push({


numero:c[8] || "",

chave:c[9] || "",

data:c[10] || "",

valor:valor,

icms:icms


});



sped.icms += icms;


}



});


}




function converterValor(valor){


if(!valor) return 0;


return Number(

valor
.replace(".","")
.replace(",",".")
);


}





function mostrar(){



qtdNotas.innerHTML =
sped.notas.length;



qtdProdutos.innerHTML =
sped.produtos.length;



qtdPart.innerHTML =
sped.participantes.length;




let total =
sped.notas.reduce(
(a,b)=>a+b.valor,
0
);



valorTotal.innerHTML =

"R$ " +

total.toLocaleString(
"pt-BR",
{
minimumFractionDigits:2
}
);





dadosEmpresa.innerHTML=

`

<h3>${sped.empresa.razao || "Não encontrado"}</h3>

<p>
CNPJ:
${sped.empresa.cnpj || ""}
</p>


<p>
Período:
${sped.empresa.inicio || ""}
até
${sped.empresa.fim || ""}
</p>


`;





resumo.innerHTML=

`

<b>Resumo Fiscal</b>

<br><br>


Notas:
${sped.notas.length}


<br>


Valor total:
R$ ${total.toLocaleString("pt-BR",
{
minimumFractionDigits:2
})}


<br>


ICMS:
R$ ${sped.icms.toLocaleString("pt-BR",
{
minimumFractionDigits:2
})}



`;





tabelaNotas.innerHTML="";



sped.notas.forEach(n=>{


tabelaNotas.innerHTML+=`

<tr>

<td>${n.numero}</td>

<td>${n.data}</td>

<td>
R$ ${n.valor.toLocaleString("pt-BR",
{
minimumFractionDigits:2
})}
</td>


<td>

<button onclick='detalhe(${JSON.stringify(n)})'>
Abrir
</button>

</td>

</tr>

`;

});



}





function auditar(){


erros.innerHTML=

`

<h3>✔ SPED processado</h3>

<p>Nenhuma inconsistência encontrada automaticamente</p>

`;


}





function detalhe(n){


modal.style.display="flex";


modalConteudo.innerHTML=

`

NF: ${n.numero}

<br>

Data:
${n.data}

<br>

Valor:
R$ ${n.valor}

`;

}




function fechar(){

modal.style.display="none";

}




function buscarNF(valor){


let filtrado=
sped.notas.filter(n=>
n.numero.includes(valor));


tabelaNotas.innerHTML="";


filtrado.forEach(n=>{


tabelaNotas.innerHTML+=`

<tr>

<td>${n.numero}</td>

<td>${n.data}</td>

<td>R$ ${n.valor}</td>

</tr>`;

});


}