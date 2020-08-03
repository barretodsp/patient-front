import RestService from '../RestService';


const DeletePatientService = async (patient_id) => {
  try {
    let resp = await RestService('patient', 'delete', 'DELETE', {patient_id})
    if (resp.status == 200) {
      return { success: 'success' }
    } else {
      return { error: resp.error }
    }
  } catch (er) {
    console.log('erro', er)
    return ({ error: 'Não foi possível realizar esta operação.' });
  }
}

export default DeletePatientService