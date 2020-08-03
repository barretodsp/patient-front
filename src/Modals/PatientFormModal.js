import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import PatientForm from '../Forms/PatientForm';
import '../assets/css/formStyle.css'
import globalStyles from '../assets/styles/globalStyles';


function PatientFormModal(props){
  const [modalDisplay, changeDisplay] = useState(false);

  useEffect(() => {
    changeDisplay(props.display)
  }, [props.display]);


  function closeModal() {
    props.updateDisplay(false)
  }

  return (
    <div>
      <Modal
        class='modal'
        isOpen={modalDisplay}
        style={globalStyles.modal}
        contentLabel="Example Modal"
      >
        <h2>Novo Paciente</h2>
        <button class="btnCancelModal" onClick={closeModal}>Cancelar</button>
        <PatientForm afterCreateCB={props.afterCreateCB}/>
      </Modal>
    </div>
  )
}

export default PatientFormModal;