import React, { useMemo, useState, useEffect } from 'react';
import DataGrid, { Column } from 'react-data-grid';
import 'react-data-grid/dist/react-data-grid.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import PatientFormModal from '../../Modals/PatientFormModal';
import CpfFormatter from '../../Formatters/CpfFormatter';
import { GoDeviceMobile, GoCircleSlash } from 'react-icons/go';
import ContactModal from '../../Modals/ContactModal';
import GetPatientsService from '../../Services/Patient/GetPatientsService';
import '../../assets/css/formStyle.css'
import DeletePatientService from '../../Services/Patient/DeletePatientService';
import UpdatePatientService from '../../Services/Patient/UpdatePatientService';
import DateFormater from '../../Formatters/DateFormatter';


function PatientScreen() {

  const [rows, setPatients] = useState([]);
  const [filters, setFilters] = useState({})
  const [enableFilters, setEnableFilters] = useState(true);
  const [modalDisplay, changeModalDisplay] = useState(false);
  const [contactDisplay, changeContactDisplay] = useState(false);
  const [alertDisplay, changeAlertDisplay] = useState(false);
  const [alertDisplayError, changeAlertDisplayError] = useState(false);
  const [alertError, setErrorMsg] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [pctContact, setPctContact] = useState();
  const [successAlert, setMsgSuccess] = useState();
  const [displayWarning, setDisplayWarning] = useState(false);
  const [warningAlert, setMsgWarning] = useState();

  const columns = [
    {
      key: 'actions',
      name: 'Ações',
      formatter: ({ row }) => {
        return (
          <div class='icon-center' >
            <span onClick={() => deletePatient(row.patient_id, row.first_name)}><GoCircleSlash /></span>
          </div>
        )
      }
    },
    {
      key: 'cpf',
      name: 'CPF',
      editable: false,
      filterRenderer: p => (
        <div className="rdg-filter-container">
          <input
            className="rdg-filter"
            value={p.value}
            onChange={e => p.onChange(e.target.value)}
          />
        </div>
      ),
      formatter: ({ row }) => <CpfFormatter value={row.cpf} />
    },
    {
      key: 'first_name',
      name: 'Nome',
      editable: true,
      filterRenderer: p => (
        <div className="rdg-filter-container">
          <input
            className="rdg-filter"
            value={p.value}
            onChange={e => p.onChange(e.target.value)}
          />
        </div>
      ),
    },
    {
      key: 'last_name',
      name: 'Sobrenome',
      editable: true,
      filterRenderer: p => (
        <div className="rdg-filter-container">
          <input
            className="rdg-filter"
            value={p.value}
            onChange={e => p.onChange(e.target.value)}
          />
        </div>
      ),
    },
    {
      key: 'contacts',
      name: 'Contato',
      editable: false,
      formatter: ({ row }) => {
        return (
          <div class='icon-center' >
            <span onClick={() => checkContacts(row.patient_id, row.contacts)}><GoDeviceMobile /></span>
          </div>
        )
      }
    },
    {
      key: 'birth_dt',
      name: 'Nascimento',
      editable: false,
      formatter: ({ row }) => <DateFormater value={row.birth_dt} />
    },
    {
      key: 'blood_type',
      name: 'Tipo Sanguíneo',
      editable: true,
      filterRenderer: p => (
        <div className="rdg-filter-container">
          <select className="rdg-filter" value={p.value} onChange={e => p.onChange(e.target.value)}>
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
      )
    },
  ];

  useEffect(async () => {
    let result = await GetPatientsService();
    if (result.success)
      setPatients(result.success)
    return;
  }, [])

  const filteredRows = useMemo(() => {
    return rows.filter(r => {
      return (
        (filters.first_name ? r.first_name.includes(filters.first_name) : true) &&
        (filters.last_name ? r.last_name.includes(filters.last_name) : true) &&
        (filters.cpf ? r.cpf.includes(filters.cpf) : true) &&
        (filters.blood_type ? r.blood_type === filters.blood_type : true)
      );
    });
  }, [rows, filters]);

  function clearFilters() {
    setFilters({
      first_name: '',
      last_name: '',
      cpf: '',
      blood_type: ''
    });
  }

  function toggleFilters() {
    setEnableFilters(!enableFilters);
  }

  const handleRowUpdate = async ({ fromRow, toRow, updated, action }) => {
    try {
      const newRows = [...rows];
      let obj = rows[fromRow];
      if (updated.hasOwnProperty('first_name') && (!(/^\s*$/.test(updated.first_name))))
        obj.first_name = updated.first_name
      if (updated.hasOwnProperty('last_name') && (!(/^\s*$/.test(updated.last_name))))
        obj.last_name = updated.last_name
      let resp = await UpdatePatientService(obj.patient_id, obj.first_name, obj.last_name, obj.blood_type);
      if (resp.success) {
        newRows[toRow] = { ...newRows[toRow], ...updated }
        setPatients(newRows)
      }
      return;
    } catch (er) {
      console.log('ERROR UPDATE >> ', er)
    }
  };

  function openModal() {
    changeModalDisplay(true);
  }

  async function afterCreateCB(resp) {
    if (resp.success) {
      setMsgSuccess('Usuário criado com sucesso!')
      changeAlertDisplay(true)
      changeModalDisplay(false)
      let result = await GetPatientsService();
      if (result.success)
        setPatients(result.success)
    } else {
      setErrorMsg(resp.error)
      changeAlertDisplayError(true);
    }
  }

  async function addContactCB(resp) {
    if (resp.success) {
      setMsgSuccess('Contato criado com sucesso!')
      changeAlertDisplay(true)
      changeContactDisplay(false)
      let result = await GetPatientsService();
      if (result.success)
        setPatients(result.success)
    } else {
      setErrorMsg(resp.error)
      changeAlertDisplayError(true);
    }
  }

  async function deleteContactCB(resp) {
    if (resp.success) {
      setMsgSuccess('Contato removido!')
      changeAlertDisplay(true)
      changeContactDisplay(false)
      let result = await GetPatientsService();
      if (result.success)
        setPatients(result.success)
    } else {
      setErrorMsg(resp.error)
      changeAlertDisplayError(true);
    }
  }


  function closeAlert() {
    changeAlertDisplay(false)
  }

  function closeAlertError() {
    changeAlertDisplayError(false)
  }

  function checkContacts(patient_id, contacts) {
    setContacts(contacts)
    setPctContact(patient_id)
    changeContactDisplay(true)
  }


  function deletePatient(patient_id, fist_name) {
    setMsgWarning(`O registro do paciente ${fist_name} será apagado.`)
    setPctContact(patient_id)
    setDisplayWarning(true)
  }

  async function confirmPctDelete() {
    setDisplayWarning(false)
    let resp = await DeletePatientService(pctContact);
    if (resp.success) {
      setMsgSuccess('Paciente removido!')
      changeAlertDisplay(true)
      let result = await GetPatientsService();
      if (result.success)
        setPatients(result.success)
    } else {
      setErrorMsg(resp.error)
      changeAlertDisplayError(true);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 10, textAlign: 'right' }}>
        <button type="button" onClick={openModal}>Cadatrar Paciente</button>
        <button type="button" onClick={toggleFilters}> {enableFilters ? 'Ocultar Filtros' : 'Exibir Filtros'} </button>{' '}
        <button type="button" onClick={clearFilters}>Limpar Filtros</button>
      </div>
      <DataGrid
        rowKey="id"
        columns={columns}
        rows={filteredRows}
        enableFilters={enableFilters}
        filters={filters}
        height={800}
        onFiltersChange={setFilters}
        onRowsUpdate={handleRowUpdate}
      />
      <PatientFormModal display={modalDisplay} updateDisplay={changeModalDisplay} afterCreateCB={afterCreateCB} />
      <ContactModal display={contactDisplay} updateDisplay={changeContactDisplay} patientId={pctContact} contacts={contacts} addCB={addContactCB} deleteCB={deleteContactCB} />
      <SweetAlert
        success
        title={successAlert}
        show={alertDisplay}
        onConfirm={closeAlert}
        confirmBtnBsStyle="success"
      >
      </SweetAlert>
      <SweetAlert
        danger
        title={alertError}
        show={alertDisplayError}
        onConfirm={closeAlertError}
        confirmBtnBsStyle="dagner"
      >
      </SweetAlert>
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Sim, deletar!"
        confirmBtnBsStyle="danger"
        title="Tem certeza que deseja continuar?"
        show={displayWarning}
        onConfirm={confirmPctDelete}
        onCancel={() => setDisplayWarning(false)}
        focusCancelBtn
      >
        {warningAlert}
      </SweetAlert>
    </div>
  );
}

export default PatientScreen;
