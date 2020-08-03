import CPF from 'cpf';

const CpfFormater = param => {
  console.log('CPF VALIDO? ', CPF.isValid(param.value))
  return CPF.format(param.value)
}

export default CpfFormater;