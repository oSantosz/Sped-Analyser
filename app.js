let sped={

empresa:{},

notas:[],

produtos:[],

participantes:[],

icms:0

};



function aba(nome){

document.querySelectorAll(".page")
.forEach(x=>x.classList.add("hidden"));


document.getElementById(nome)
.classList.remove("hidden");

}




function consultar(){


let arquivo =
document.getElementById("arquivo").files[0];


if(!arquivo){

alert("Selecione um arquivo SPED");

return;

}



let reader=new FileReader();



reader.onload=function(e){

lerSPED(e.target.result);

mostrar();

};



reader.readAsText(arquivo);



}





function valorNumero(v){


if(!v)
return 0;



return Number(

v
.replace(/\./g,"")
.replace(",",".")
);


}





function lerSPED(txt){



sped={

empresa:{},

notas:[],

produtos:[],

participantes:[],

icms:0

};




txt.split(/\r?\n/)
.forEach(linha=>{



let c=linha.split("|");

let registro=c[1];



if(!registro)
return;





// EMPRESA

if(registro=="0000"){


sped.empresa={

razao:c[6],

cnpj:c[7],

inicio:c[4],

fim:c[5]

};


}






// PARTICIPANTES

if(registro=="0150"){


sped.participantes.push({

codigo:c[2],

nome:c[3]

});


}






// PRODUTOS

if(registro=="0200"){


sped.produtos.push({

codigo:c[2] || "",

descricao:c[3] || "",

unidade:c[6] || "",

ncm:c[8] || ""

});


}







// NOTAS

if(registro=="C100"){


let valor =
valorNumero(c[12]);



let icms =
valorNumero(c[22]);



sped.notas.push({

numero:c[8],

data:c[10],

valor:valor,

icms:icms

});


sped.icms+=icms;


}



});



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
"R$ "+
total.toLocaleString(
"pt-BR",
{
minimumFractionDigits:2
});





resumo.innerHTML=`

Notas:
<b>${sped.notas.length}</b>

<br>

Produtos:
<b>${sped.produtos.length}</b>

<br>

ICMS:
<b>
R$ ${sped.icms.toLocaleString("pt-BR",
{
minimumFractionDigits:2
})}
</b>

`;






dadosEmpresa.innerHTML=`

<h3>
${sped.empresa.razao || ""}
</h3>

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





tabelaProdutos.innerHTML="";



sped.produtos.forEach(p=>{


tabelaProdutos.innerHTML+=`

<tr>

<td>${p.codigo}</td>

<td>${p.descricao}</td>

<td>${p.unidade}</td>

<td>${p.ncm}</td>

</tr>


`;

});



}




function detalhe(n){


modal.style.display="flex";


modalConteudo.innerHTML=`

NF:
${n.numero}

<br>

Data:
${n.data}

<br>

Valor:
R$ ${n.valor}

<br>

ICMS:
R$ ${n.icms}

`;

}





function fechar(){

modal.style.display="none";

}




function buscarNF(texto){


let lista =
sped.notas.filter(n=>
n.numero.includes(texto)
);



tabelaNotas.innerHTML="";



lista.forEach(n=>{


tabelaNotas.innerHTML+=`

<tr>

<td>${n.numero}</td>

<td>${n.data}</td>

<td>
R$ ${n.valor}
</td>

</tr>

`;


});


}