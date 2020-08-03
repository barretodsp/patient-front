import CPF from 'cpf';

const CpfFormater = param => {
  return CPF.format(param.value)
}

export default CpfFormater;