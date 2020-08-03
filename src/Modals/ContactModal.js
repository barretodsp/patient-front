import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';


function ContactModal(props) {
  const [modalDisplay, changeDisplay] = useState(false);
  const [contacts, setContact] = useState([]);

  useEffect(() => {
    changeDisplay(props.display)
  }, [props.display]);


  useEffect(() => {
    setContact(props.contacts)
  }, [props.contacts]);

  function closeModal() {
    props.updateDisplay(false)
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
    if (contacts != null && contacts != undefined && Array.isArray(contacts)) {
      return (
        <>
          <ul>
            {contacts.map((contact, i) => <li key={i}>{contact.contact_number} </li>)}
          </ul>
        </>
      )
    } else {
      return (
        <p>Sem Contatos Cadastrados. </p>
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
        <button onClick={closeModal}>Cancelar</button>
        {renderContacts(contacts)}
      </Modal>
    </div>
  )
}

export default ContactModal;