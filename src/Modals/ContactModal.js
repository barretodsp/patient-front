import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../assets/css/formStyle.css'
import InputMask from 'react-input-mask';
import AddContactService from '../Services/Patient/AddContactService';
import DeleteContactService from '../Services/Patient/DeleteContactService';
import { GoCircleSlash } from 'react-icons/go';

function ContactModal(props) {
  const [modalDisplay, changeDisplay] = useState(false);
  const [contacts, setContact] = useState([]);
  const [displayNew, setDisplayNew] = useState();
  const [valueCt, setValueCt] = useState('');

  useEffect(() => {
    changeDisplay(props.display)
  }, [props.display]);


  useEffect(() => setContact(props.contacts),
    [props.contacts]) 

  function closeModal() {
    props.updateDisplay(false)
  }

  async function remove(id) {
    let resp = await DeleteContactService(id);
    props.deleteCB(resp);
  }

  async function add() {
    let resp = await AddContactService(props.patientId, valueCt);
    props.addCB(resp);
  }

  function show() {
    setDisplayNew(true)
  }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      zIndex: 1,
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }
  };

  const renderContacts = (contacts) => {
    if (contacts && Array.isArray(contacts) && contacts.length > 0) {
      return (
        <>
          <ul>
            {contacts.map((contact, i) => {
              return (
                <div class='row'>
                  <li key={i}>{contact[1]}  <span onClick={() => remove(contact[0])}><GoCircleSlash /></span> </li>
                </div>
              )
            })}
          </ul>
        </>
      )
    } else {
      return (
        <p>Sem Contatos Cadastrados. </p>
      )
    }
  }


  const renderNewForm = () => {
    if (displayNew) {
      return (
        <div class="row blockField" >
          <label>
            Telefone Celular
          <div class="row">
              <InputMask
                class="input-field-sm"
                value={valueCt}
                // mask={valueCt.replace(/\D/g,'').length == 10 ? (setTimeout("(99)9999-9999", 3000)) : "(99)99999-9999" }
                mask={"(99)99999-9999"}
                onChange={e => setValueCt(e.target.value)}
                disableUnderline
              />
            </div>
          </label>
          <button onClick={add}> Criar </button>
        </div>
      )
    } else {
      return (
        <p> </p>
      )
    }
  }


  return (
    <div>
      <Modal
        isOpen={modalDisplay}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2>Contatos do Paciente</h2>
        <button onClick={closeModal}>Fechar</button>
        <button onClick={show}>Novo Contato</button>

        {renderContacts(contacts)}
        {renderNewForm()}
      </Modal>
    </div>
  )
}

export default ContactModal;