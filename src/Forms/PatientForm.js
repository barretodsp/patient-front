import React, { useState } from 'react';
import useForm from '../CustomHooks/useForm';
import CreatePatientService from '../Services/Patient/CreatePatientService';
import DatePicker from "react-datepicker";
import InputMask from 'react-input-mask';
import MaterialInput from '@material-ui/core/Input';
import { Form, FormGroup, FormControl, ControlLabel, HelpBlock } from 'rsuite';
import '../assets/css/formStyle.css'


function PatientForm(props) {

  // const [{ values, loading }, handleChange, handleSubmit] = useForm();
  const [valueBirth, setBirth] = useState("");
  const [valueBlood, setBlood] = useState("");
  const [valueFName, setFName] = useState("");
  const [valueLName, setLName] = useState("");
  const [valueTel1, setTel1] = useState("");
  const [valueTel2, setTel2] = useState("");
  const [valueCpf, setCpf] = useState("");

  const bloodOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  const createPatient = async (event) => {
    event.preventDefault();

    let contacts = [];
    if (!(/^\s*$/.test(valueTel1)))
      contacts.push(valueTel1)
    if (!(/^\s*$/.test(valueTel2)))
      contacts.push(valueTel2)

    let resp = await CreatePatientService({
      first_name: valueFName,
      last_name: valueLName,
      birth_dt: valueBirth,
      blood_type: valueBlood,
      cpf: valueCpf,
      contacts,
    });
    console.log('RESP FORM', resp)
    props.afterCreateCB(resp);
  }

  return (
    <form onSubmit={createPatient} class='patient-form'>
      <div class="container">
        <div class="row block-field" >
          <label>
            Primeiro Nome
            <div class="row">
              <input
                class="input-field"
                value={valueFName}
                onChange={e => setFName(e.target.value)}
                type="text"
                name="first_name"
                placeholder="Digite seu primerio nome"
              />
            </div>
          </label>
        </div>


        <div class="row block-field" >
          <label>
            Sobrenome
            <div class="row">
              <input
                class="input-field"
                value={valueLName}
                onChange={e => setLName(e.target.value)}
                type="text"
                name="last_name"
                placeholder="Digite seu primerio sobrenome"
              />
            </div>
          </label>
        </div>
        <div class="row block-field" >
          <label>
            Data de Nascimento
            <div class="row">
              <InputMask
                class="input-field-sm"
                value={valueBirth}
                mask="99/99/9999"
                onChange={e => setBirth(e.target.value)}
                disableUnderline
              />
            </div>
          </label>
        </div>

        <div class="row block-field" >
          <label>
            CPF
            <div class="row">
              <InputMask
                class="input-field-sm"
                value={valueCpf}
                mask="999.999.999-99"
                onChange={e => setCpf(e.target.value)}
                disableUnderline
              />
            </div>
          </label>
        </div>

        <div class="row block-field" >
          <label>
            Telefone Fixo
          <div class="row">
              <InputMask
                class="input-field-sm"
                value={valueTel1}
                mask={"(99)9999-9999"}
                onChange={e => setTel1(e.target.value)}
                disableUnderline
              />
            </div>
          </label>
        </div>

        <div class="row block-field" >
          <label>
            Telefone Celular
            <div class="row">
              <InputMask
                class="input-field-sm"
                value={valueTel2}
                mask={"(99)99999-9999"}
                onChange={e => setTel2(e.target.value)}
                disableUnderline
              />
            </div>
          </label>
        </div>

        <div class="row block-field" >
          <label>
            Tipo Sanguíneo:
            <div class="row">
              <select class="input-field-sm" onChange={e => setBlood(e.target.value)}>
                <option value=""></option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </label>
        </div>

        <button class='btn-send-modal' type="submit">Enviar</button>
      </div>
    </form>
  )

}

export default PatientForm;