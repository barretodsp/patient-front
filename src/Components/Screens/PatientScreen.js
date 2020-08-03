import React, { useMemo, useState, useEffect } from 'react';
import DataGrid, { Column } from 'react-data-grid';
import 'react-data-grid/dist/react-data-grid.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import PatientFormModal from '../../Modals/PatientFormModal';
import CpfFormatter from '../../Formatters/CpfFormatter';
import CPF from 'cpf';
import moment from 'moment';
import { GoDeviceMobile, GoCircleSlash } from 'react-icons/go';
import ContactModal from '../../Modals/ContactModal';
import GetPatientsService from '../../Services/Patient/GetPatientsService';
import '../../assets/css/formStyle.css'


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

  const columns = [
    {
      key: 'actions',
      name: 'Ações'
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
            <span onClick={() => checkContacts(row.patient_id, row.contacts)}><GoDeviceMobile  /></span>
          </div>
        )
      }
    },
    {
      key: 'birth_dt',
      name: 'Nascimento',
      editable: false,
    },
    {
      key: 'blood_type',
      name: 'Tipo Sanguíneo',
      editable: true,
      filterRenderer: p => (
        <div className="rdg-filter-container">
          <select className="rdg-filter" value={p.value} onChange={e => p.onChange(e.target.value)}>
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
    console.log('RESULT', result);
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
        // && (filters.issueType !== 'All' ? r.issueType === filters.issueType : true)
        // && (filters.developer ? r.developer === filters.developer.value : true)
        // && (filters.complete ? filters.complete.filterValues(r, filters.complete, 'complete') : true)
      );
    });
  }, [rows, filters]);

  function clearFilters() {
    setFilters({
      id: '',
      title: '',
      email: ''
    });
  }

  function toggleFilters() {
    setEnableFilters(!enableFilters);
  }

  const handleRowUpdate = ({ fromRow, toRow, updated, action }) => {
    // this.grid.openCellEditor(rowIdx, idx);
    try {
      if (updated.hasOwnProperty('cpf') && CPF.isValid(updated.cpf)) {
        console.log('CPF VALIDO?', CPF.isValid(updated.cpf))
        console.log('TRANS?', CPF.format(updated.cpf))
      } else if (updated.hasOwnProperty('nascimento')) {
        console.log('111 DATA MOMENT', moment('1993-08-12').format('DD/MM/YYYY'))
        console.log('222 DATA MOMENT', moment('12/08/1993').format('YYYY-MM-DD'))

      }
      console.log('ROW In ID', rows[fromRow])
      console.log('From = ', fromRow);
      console.log('To = ', toRow)
      console.log('Updated = ', updated)
      console.log('Action = ', action)
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

  return (
    <div>
      <div style={{ marginBottom: 10, textAlign: 'right' }}>
        <button type="button" onClick={openModal}>Cadatrar Paciente</button>
        <button type="button" onClick={toggleFilters}>Toggle Filters</button>{' '}
        <button type="button" onClick={clearFilters}>Clear Filters</button>
      </div>
      <DataGrid
        rowKey="id"
        columns={columns}
        rows={filteredRows}
        enableFilters={enableFilters}
        filters={filters}
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
    </div>
  );
}

export default PatientScreen;
