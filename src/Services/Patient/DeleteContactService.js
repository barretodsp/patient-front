import RestService from '../RestService';


const DeleteContactService = async (contact_id) => {
  try {
    let resp = await RestService('contact', 'delete', 'DELETE', {contact_id})
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

export default DeleteContactService