
import moment from 'moment';
import CPF from 'cpf';

let resp = null;
const success = { success: 'success' }


const setValidateCreate = async (patient) => {
  try {

    resp = await checkFName(patient.first_name)
    if (resp['error']) return resp

    resp = await checkLName(patient.last_name)
    if (resp['error']) return resp

    resp = await checkBirthdate(patient.birth_dt)
    if (resp['error']) return resp

    resp = await checkCPF(patient.cpf)
    if (resp['error']) return resp

    resp = await checkBloodType(patient.blood_type)
    if (resp['error']) return resp

    resp = await checkContacts(patient.contacts)
    if (resp['error']) return resp
    return success;


  } catch (er) {
    console.log('ERRO VALIDATE', er);
    return { error: er }
  }
}

//Validates Cases

async function checkFName(name) {
  try {
    if (name && !(/^\s*$/.test(name))) return success
    return { error: 'Nome inválido.' }
  } catch (er) {
    return { error: 'Nome inválido.' }
  }
}

async function checkLName(name) {
  try {
    if (name && !(/^\s*$/.test(name))) return success
    return { error: 'Sobrenome inválido.' }
  } catch (er) {
    return { error: 'Sobrenome inválido.' }
  }
}

async function checkBloodType(bloodType) {
  try {
    if (!(/^\s*$/.test(bloodType))) return success
    return { error: 'Selecione um tipo sanguíneo' }
  } catch (er) {
    return { error: 'Selecione um tipo sanguíneo' }
  }
}

async function checkBirthdate(birthdate) {
  try {
    console.log('Data', birthdate);
    let today = moment();
    let date = moment(birthdate, 'DD/MM/YYY');
    if (date.isValid() && (date.valueOf() < today.valueOf())) return success
    return { error: 'Data de nascimento inválida.' }
  } catch (er) {
    return { error: 'Data de nascimento inválida.' }
  }
}

async function checkCPF(cpf) {
  try {
    if (!(/^\s*$/.test(cpf.toString())) && (CPF.isValid(cpf))) return success
    return ({ error: 'CPF inválido.' })
  } catch (er) {
    return ({ error: 'CPF inválido.' })
  }
}

async function checkContacts(contacts) {
  try {
    console.log('Contacts QTD', contacts)
    if (contacts.length == 0)
      return ({ error: 'Número de contato obrigatório.' })
    for (var i = 0; i < contacts.length; i++) {
      if (contacts[i].replace(/\D/g, '').length < 10) return ({ error: `Número ${i == 0 ? 'Fixo' : 'Celular'} inválido` })
    }
    return success
  } catch (er) {
    return ({ error: 'Número de contato obrigatório.' })
  }
}

export default {
  setValidateCreate
}