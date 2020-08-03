const CreatePatientService = (params) => {
  try{
    console.log('PARAMS NO SERVICE', params)
    return { success: 'success'}
  }catch(er){
    return 'error'
  }
}

export default CreatePatientService