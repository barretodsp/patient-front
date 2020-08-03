import RestService from '../RestService';


const AddContactService = async (patient_id, contact_number) => {
  try {
    if (contact_number&& contact_number.replace(/\D/g, '').length < 10) return ({ error: `Número inválido` })

    let resp = await RestService('contact', 'create', 'POST', {patient_id, contact_number})
    if (resp.status == 201) {
      return { success: 'success' }
    } else {
      return { error: resp.error }
    }
  } catch (er) {
    console.log('erro', er)
    return ({ error: 'Não foi possível realizar esta operação.' });
  }
}

export default AddContactService