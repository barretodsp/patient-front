import RestService from '../RestService';

const GetPatientsService = async () => {
  try {
    let resp = await RestService('patient', 'getAll', 'GET')
    if(resp.status === 200){
      return {success: resp.data}
    }else{
      return {error: resp.error}
    }
  } catch (er) {
    console.log('erro', er)
    return ({error: 'Não foi possível realizar esta operação.'});
  }
}

export default GetPatientsService