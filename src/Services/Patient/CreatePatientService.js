import RestService from '../RestService';
import PatientValidator from '../../Validators/PatientValidator';
import moment from 'moment';


const CreatePatientService = async (params) => {
  try {
    let valid = await PatientValidator.setValidateCreate(params);
    if (valid.success) {
      params.cpf = params.cpf.replace(/\D/g,'');
      params.birth_dt = moment(params.birth_dt, 'DD/MM/YYYY').format('YYYY-MM-DD');
      let resp = await RestService('patient', 'create', 'POST', params)
      if (resp.status == 201) {
        return { success: 'success' }
      } else {
        return { error: resp.error }
      }
    } else {
      return valid
    }

  } catch (er) {
    console.log('erro', er)
    return ({ error: 'Não foi possível realizar esta operação.' });
  }
}

export default CreatePatientService