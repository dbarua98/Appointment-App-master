
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'devextreme-react';
import AppointmentModal from './AppointmentModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DeleteConfirmationModal } from '../../components';
import moment from 'moment';
import DataGrid, { Column, Button as GridButton,  GroupPanel, Sorting, FilterRow, HeaderFilter, Pager, Paging } from 'devextreme-react/data-grid';
import { LoadPanel } from 'devextreme-react/load-panel';

const AppointmentList = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [stateList, setStateList] = useState([]);
    const [filterCity, setFilterCity] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteAppointmentId, setDeleteAppointmentId] = useState(null);
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
    const initialData = {
        appointmentID: 0,
        appointmentDateTime: moment().toDate(),
        firstName: "",
        lastName: "",
        fullName: "",
        dob: tenYearsAgo,
        gender: null,
        mobileNo: "",
        maritalStatus: null,
        address: "",
        stateID: null,
        cityID: null,
        reasonForAppointment: "",
        specialityID: null,
        doctorID: null
    }
    const [patientAppointment, setPatientAppointment] = useState(initialData)
    const deleteMessage = "Are you sure you want to delete this Appointment?"
    const [loadPanelVisible, setLoadPanelVisible] = useState(false);



    useEffect(() => {
        if (!token) {
            navigate('/')
        }
    }, [])

    useEffect(() => {
        debugger
        let filteredCities = cityList.filter(city => city.StateID === parseInt(patientAppointment.stateID));
        setFilterCity(filteredCities)
    }, [patientAppointment.stateID])


    const fetchPatientList = async () => {
        setLoadPanelVisible(true)
        try {
            const response = await axios.get('https://localhost:7137/api/Patient/GetList', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const patientList = response.data;
            setAppointments(patientList)
            setLoadPanelVisible(false)
            console.log('Patient list:', patientList);
        } catch (error) {
            console.error('Error fetching patient list:', error.message);
            setLoadPanelVisible(false)
        }
    }

    const fetchStateList = async () => {
        try {
            const response = await axios.get('https://localhost:7137/api/State/GetList', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const stateList = response.data;
            setStateList(stateList)
            console.log('State list:', stateList);
        } catch (error) {
            console.error('Error fetching state list:', error.message);
        }
    }

    const fetchCityList = async () => {
        try {
            const response = await axios.get('https://localhost:7137/api/City/GetList', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const cityList = response.data;
            setCityList(cityList)
            console.log('City list:', cityList);
        } catch (error) {
            console.error('Error fetching city list:', error.message);
        }
    }

    useEffect(() => {
        fetchPatientList()
        fetchStateList()
        fetchCityList()

    }, [])

    const handleCloseModal = () => {
        setPatientAppointment(initialData)
        setIsModalOpen(false);
        setSelectedAppointment(null);
    };

    const handleAddClick = () => {
        setSelectedAppointment(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (appointment) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
    };


    const handleSaveAppointment = async (e) => {
        e.preventDefault();
        debugger
        if (selectedAppointment) {
            const selectedDateTime = new Date(patientAppointment.appointmentDateTime);
            // Get the timezone offset in minutes
            const timezoneOffset = selectedDateTime.getTimezoneOffset();
            // Adjust the date and time by subtracting the timezone offset
            selectedDateTime.setMinutes(selectedDateTime.getMinutes() - timezoneOffset);
            // Convert the adjusted date and time to ISO 8601 format
            const isoDateTime = selectedDateTime.toISOString();
            console.log("updateData", patientAppointment)
            const updatedPatientData = {
                "appointmentID": patientAppointment.appointmentID,
                "appointmentDateTime": isoDateTime,
                "firstName": patientAppointment.firstName,
                "lastName": patientAppointment.lastName,
                "fullName": patientAppointment.fullName,
                "dob": patientAppointment.dob,
                "gender": parseInt(patientAppointment.gender),
                "mobileNo": (patientAppointment.mobileNo).toString(),
                "maritalStatus": parseInt(patientAppointment.maritalStatus),
                "address": patientAppointment.address,
                "stateID": parseInt(patientAppointment.stateID),
                "cityID": parseInt(patientAppointment.cityID),
                "reasonForAppointment": patientAppointment.reasonForAppointment,
                "specialityID": parseInt(patientAppointment.specialityID),
                "doctorID": parseInt(patientAppointment.doctorID)
            }
            try {
                const response = await axios.put(`https://localhost:7137/api/Patient/Update/`, updatedPatientData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Patient updated successfully:');
                fetchPatientList();
                setPatientAppointment(initialData)
            } catch (error) {
                console.error('Error updating patient:', error.message);
            }
        } else {
            console.log("first", patientAppointment)
            const selectedDateTime = new Date(patientAppointment.appointmentDateTime);
            // Get the timezone offset in minutes
            const timezoneOffset = selectedDateTime.getTimezoneOffset();
            // Adjust the date and time by subtracting the timezone offset
            selectedDateTime.setMinutes(selectedDateTime.getMinutes() - timezoneOffset);
            // Convert the adjusted date and time to ISO 8601 format
            const isoDateTime = selectedDateTime.toISOString();
            const patientData = {
                "appointmentID": 0,
                "appointmentDateTime": isoDateTime,
                "firstName": patientAppointment.firstName,
                "lastName": patientAppointment.lastName,
                "fullName": patientAppointment.fullName,
                "dob": patientAppointment.dob,
                "gender": parseInt(patientAppointment.gender),
                "mobileNo": (patientAppointment.mobileNo).toString(),
                "maritalStatus": parseInt(patientAppointment.maritalStatus),
                "address": patientAppointment.address,
                "stateID": parseInt(patientAppointment.stateID),
                "cityID": parseInt(patientAppointment.cityID),
                "reasonForAppointment": patientAppointment.reasonForAppointment,
                "specialityID": parseInt(patientAppointment.specialityID),
                "doctorID": parseInt(patientAppointment.doctorID)
            }
            try {
                const response = await axios.post('https://localhost:7137/api/Patient/Insert', patientData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = response.data;
                console.log('Patient inserted successfully:', data);
                setPatientAppointment(initialData)
                fetchPatientList();
            } catch (error) {
                console.error('Error inserting patient:', error.message);
            }
        }
        setIsModalOpen(false);
    };

    const handleDeleteClick = async (appointmentId) => {
        setDeleteAppointmentId(appointmentId)
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            const response = await axios.delete(`https://localhost:7137/api/Patient/Delete/${deleteAppointmentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchPatientList()
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting item:', error.message);
        }
    };

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
    };




    const handleChange = useCallback((name, value) => {
        setPatientAppointment(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, []);


    const handleDateChange = (value) => {
        setPatientAppointment({ ...patientAppointment, dob: value });
    };


    const onDateTimeValueChanged = useCallback((args) => {
        setPatientAppointment((prevApp) => ({
            ...prevApp,
            appointmentDateTime: args.value
        }));
    }, []);
    const onDateValueChanged = useCallback((args) => {
        setPatientAppointment((prevApp) => ({
            ...prevApp,
            dob: args.value
        }));
    }, []);

    const handleDoctorChange = (selectedOption) => {
        setPatientAppointment({ ...patientAppointment, doctorID: selectedOption.value });
    };



    const handleSpecialtyChange = useCallback((args) => {
        setPatientAppointment((prevApp) => ({
            ...prevApp,
            specialityID: args.value
        }));
    }, []);



    const handleStateChange = useCallback((args) => {
        setPatientAppointment((prevApp) => ({
            ...prevApp,
            stateID: args.value
        }));
    }, []);

    const handleGenderChange = useCallback((args) => {
        setPatientAppointment((prevApp) => ({
            ...prevApp,
            gender: args.value
        }));
    }, []);
    const handleMaritalStatusChange = useCallback((args) => {
        setPatientAppointment((prevApp) => ({
            ...prevApp,
            maritalStatus: args.value
        }));
    }, []);


    const handleCityChange = useCallback((args) => {
        setPatientAppointment((prevApp) => ({
            ...prevApp,
            cityID: args.value
        }));
    }, []);


    return (
        <React.Fragment>
            <LoadPanel
                shadingColor="rgba(0,0,0,0.4)"
                visible={loadPanelVisible}
            />
            <h2 className={'content-block'}>Appointment List</h2>
            <div className="w-100 d-flex justify-content-end">
                <Button variant="primary" onClick={handleAddClick}>Add</Button>
            </div>
            <DataGrid
                dataSource={appointments}
                showBorders={true}
                width="100%"

            >
                <Paging defaultPageSize={10} />
                <Pager showPageSizeSelector={true} showInfo={true} />
                <GroupPanel visible={true} />
                <Sorting mode='multiple' />
                <FilterRow visible={true} />
                <HeaderFilter visible={true} allowSearch="true" />
                <Column dataField='FullName' caption='Full Name' minWidth={200} />
                <Column dataField='Gender' caption='Gender' minWidth={200} alignment='left'  cellRender={data => data.value === 0 ? <td>Male</td> : <td>Female</td>}>
                    <HeaderFilter allowSelectAll={true} dataSource={[
                        { value: 0, text: 'Male' },
                        { value: 1, text: 'Female' }
                    ]} >

                    </HeaderFilter>

                </Column>
                <Column dataField='SpecialityName' caption='Speciality Name' minWidth={200}  />
                <Column dataField='DoctorName' caption='Doctor Name' minWidth={200} />
                <Column type='buttons' minWidth={250}>
                    <GridButton text='Edit' icon='edit' onClick={(row) => handleEditClick(row.row.data)} />
                    <GridButton text='Delete' icon='trash' onClick={(row) => handleDeleteClick(row.row.data.AppointmentID)} />
                </Column>
            </DataGrid>

            {isModalOpen &&
                <AppointmentModal
                    show={isModalOpen}
                    handleClose={handleCloseModal}
                    handleSave={handleSaveAppointment}
                    selectedAppointment={selectedAppointment}
                    patientAppointment={patientAppointment}
                    handleChange={handleChange}
                    handleDateChange={handleDateChange}
                    handleDoctorChange={handleDoctorChange}
                    handleSpecialtyChange={handleSpecialtyChange}
                    stateList={stateList}
                    handleStateChange={handleStateChange}
                    cityList={filterCity}
                    handleCityChange={handleCityChange}
                    setPatientAppointment={setPatientAppointment}
                    handleGenderChange={handleGenderChange}
                    handleMaritalStatusChange={handleMaritalStatusChange}
                    onDateTimeValueChanged={onDateTimeValueChanged}
                    onDateValueChanged={onDateValueChanged}
                />
            }

            <DeleteConfirmationModal
                show={isDeleteModalOpen}
                handleClose={handleDeleteModalClose}
                handleDelete={handleDeleteConfirmed}
                deleteMessage={deleteMessage}
               
            />
        </React.Fragment>

    );
};

export default AppointmentList;
