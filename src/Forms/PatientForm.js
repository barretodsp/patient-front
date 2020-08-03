import React, { useState } from 'react';
import useForm from '../CustomHooks/useForm';
import CreatePatientService from '../Services/Patient/CreatePatientService';

function PatientForm(props) {
  
  const [{ values, loading }, handleChange, handleSubmit] = useForm();

  const createPatient = async () => {
      let resp = await CreatePatientService({title: 'title X', email: 'email@email.com'});
      props.afterCreateCB(resp);
  }

  return (
    <form onSubmit={handleSubmit(createPatient)}>
        <input
          onChange={handleChange}
          type="text"
          name="id"
          placeholder="Digite o ID"
        />
        <input
          onChange={handleChange}
          type="text"
          name="email"
          placeholder="Digite o seu e-mail"
        />
        <input
          onChange={handleChange}
          type="text"
          name="title"
          placeholder="title"
        />
        <button type="submit">{loading ? "Enviando..." : "Enviar"}</button>
      </form>
  )

}

export default PatientForm;