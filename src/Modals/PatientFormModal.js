import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import PatientForm from '../Forms/PatientForm';


function PatientFormModal(props){
  const [modalDisplay, changeDisplay] = useState(false);

  useEffect(() => {
    changeDisplay(props.display)
  }, [props.display]);


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

  return (
    <div>
      <Modal
        isOpen={modalDisplay}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2>Novo Paciente</h2>
        <button onClick={closeModal}>Cancelar</button>
        <div>I am a modal</div>
        <PatientForm afterCreateCB={props.afterCreateCB}/>
      </Modal>
    </div>
  )
}

export default PatientFormModal;