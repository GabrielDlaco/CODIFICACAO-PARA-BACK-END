//AULA 01
import soma from './modulo_soma.js';

//Importar um Módulo CORE
import os from "node:os";
//Importar um módulo externo!
import chalk from 'chalk'

console.log(soma(5, 5))

//Módulo CORE
console.log('CPUS', os.cpus())
// console.log('Memória livre', os.freemem())
// console.log('Diretório atual', os.homedir())
// console.log('Sistema Operacional', os.type())

console.log('em Bytes', os.freemem())
console.log('em Giga', ((os.freemem())/10**9).toFixed(2))

//Módulo externo
let nota =8
if(nota >= 7){
    console.log(chalk.bgGreen.bold('Aprovado'))
}else{
    console.log(chalk.bgRed.bold('Reprovado'))
}   