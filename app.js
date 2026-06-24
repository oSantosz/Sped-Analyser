function filtrarNotas(){


let numero =
document.getElementById("filtroNumero").value.toLowerCase();


let serie =
document.getElementById("filtroSerie").value.toLowerCase();


let modelo =
document.getElementById("filtroModelo").value.toLowerCase();


let data =
document.getElementById("filtroData").value.toLowerCase();


let valor =
document.getElementById("filtroValor").value.toLowerCase();


let chave =
document.getElementById("filtroChave").value.toLowerCase();




let lista =
sped.notas.filter(n=>


n.numero.toLowerCase().includes(numero)

&&

n.serie.toLowerCase().includes(serie)

&&

n.modelo.toLowerCase().includes(modelo)

&&

n.data.toLowerCase().includes(data)

&&

String(n.valor).includes(valor)

&&

n.chave.toLowerCase().includes(chave)

);



tabelaNotas.innerHTML="";



lista.forEach(n=>{


tabelaNotas.innerHTML+=`

<tr>

<td>${n.numero}</td>

<td>${n.serie}</td>

<td>${n.modelo}</td>

<td>${n.data}</td>

<td>

R$ ${n.valor.toLocaleString("pt-BR",
{
minimumFractionDigits:2
})}

</td>


<td>

${n.chave}

</td>


<td>

<button onclick='detalhe(${JSON.stringify(n)})'>

Abrir

</button>


</td>


</tr>`;


});


}