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
          <>
            <span onClick={() => checkContacts(row.contacts)}><GoDeviceMobile /></span>
          </>
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
        (filters.title ? r.title.includes(filters.title) : true) &&
        (filters.email ? r.email.includes(filters.email) : true)
        // (filters.task ? r.task.includes(filters.task) : true)
        // && (filters.priority !== 'All' ? r.priority === filters.priority : true)
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
    let newRows = [...rows];
    console.log('AFTER DC', resp)
    if (resp.success) {
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

  function closeAlert() {
    changeAlertDisplay(false)
  }

  function closeAlertError() {
    changeAlertDisplayError(false)
  }
  // function closeModal(){
  //   setIsOpen(false);
  // }

  function checkContacts(contacts) {
    changeContactDisplay(true)
    setContacts(contacts)
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
      <ContactModal display={contactDisplay} updateDisplay={changeContactDisplay} contacts={contacts} />
      <SweetAlert
        success
        title="Usuário criado com sucesso"
        show={alertDisplay}
        onConfirm={closeAlert}
        confirmBtnBsStyle="success"
      >
        HAHA
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
