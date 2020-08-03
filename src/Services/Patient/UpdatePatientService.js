import RestService from '../RestService';


const UpdatePatientService = async (patient_id, first_name, last_name, blood_type) => {
  try {
    let resp = await RestService('patient', 'update', 'POST', {patient_id, first_name, last_name, blood_type})
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

export default UpdatePatientService