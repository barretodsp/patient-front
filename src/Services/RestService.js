const RestService = async (modelName, serviceName, method, paramsObject = null) => {
  try {
    let resp = null;
    let resp2json = null;
    let status = null;
    console.log('SERVICE', serviceName)
    resp = await fetch(`http://localhost:4000/api/v1/${modelName}/${serviceName}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: paramsObject ? JSON.stringify(paramsObject) : undefined
    })
    status = resp.status;
    resp2json = await resp.json();
    resp2json.status = status;
    return resp2json;
  } catch (er) {
    return ({error: er});
  }
}

export default RestService;