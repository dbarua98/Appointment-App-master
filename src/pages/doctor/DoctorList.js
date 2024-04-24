import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'devextreme-react';
import DoctorModal from './DoctorModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DeleteConfirmationModal } from '../../components';
import { LoadPanel } from 'devextreme-react/load-panel';
import DataGrid, {
     Column,
    Button as GridButton,
    HeaderFilter,
    FilterRow,
    Sorting,
    Grouping,
    GroupPanel,
    Lookup,
    Paging,
    Pager,
} from 'devextreme-react/data-grid';
const DoctorList = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [doctorsList, setDoctorsList] = useState([]);
    const [specialtiesList, setSpecialtiesList] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteDoctorId, setDeleteDoctorId] = useState(null);
    const initialData = {
        DoctorName: "",
        SpecialityID: null,
        Education: "",
    }
    const [doctor, setDoctor] = useState(initialData);
    const [inUseError, setInUseError] = useState(false)
    const deleteMessage = "Are you sure you want to delete this Doctor?"

    useEffect(() => {
        if (!token) {
            navigate('/')
        }
    }, [])



    const fetchDoctorList = async () => {
        setLoadPanelVisible(true)
        try {
            setTimeout(async () => {
                const response = await axios.get('https://localhost:7137/api/Doctor/GetList', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const doctorList = response.data;
                setDoctorsList(doctorList)
                console.log('Doctor list:', doctorList);
                setLoadPanelVisible(false)
            }, 500)

        } catch (error) {
            console.error('Error fetching doctor list:', error.message);
            setLoadPanelVisible(false)
        }
    }

    const fetchSpecialtyList = async () => {
        try {
            const response = await axios.get('https://localhost:7137/api/Speciality/GetLookupList', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const specialities = response.data;
            setSpecialtiesList(specialities)
            console.log('Speciality list:', specialities);
        } catch (error) {
            console.error('Error fetching speciality list:', error.message);
        }
    }

    useEffect(() => {
        fetchDoctorList();
        fetchSpecialtyList();
    }, [])

    const handleAddClick = () => {
        setSelectedDoctor(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setDoctor(initialData)

    };

 

    const handleSaveDoctor = async (e) => {
        e.preventDefault();
        if (selectedDoctor) {
            console.log("Selected Doctor", selectedDoctor)
            const updatedDoctorData = {
                doctorID: selectedDoctor.DoctorID,
                doctorName: doctor.DoctorName,
                specialityID: doctor.SpecialityID,
                education: doctor.Education
            }
            try {
                const response = await axios.put(`https://localhost:7137/api/Doctor/Update/`, updatedDoctorData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                fetchDoctorList();
                setDoctor(initialData)
                console.log('Doctor updated successfully:');
                setIsModalOpen(false);
            } catch (error) {
                console.error('Error updating doctor:', error.message);
                if (error.response.data.includes("Cannot accept duplicate doctor name")) {
                    // setDuplicateError(true);
                }
            }

        } else {
            // Add New Doctor
            try {
                const data = {
                    doctorName: doctor?.DoctorName,
                    specialityID: doctor?.SpecialityID,
                    education: doctor?.Education
                }
                const response = await axios.post('https://localhost:7137/api/Doctor/Insert', data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                fetchDoctorList();
                setDoctor(initialData)
                console.log('Doctor inserted successfully:');
                setIsModalOpen(false);
            } catch (error) {
                console.error('Error inserting doctor:', error.message);
                if (error.response.data.includes("Cannot accept duplicate doctor name")) {
                    // setDuplicateError(true);
                }
            }
        }

    };

    const handleEditDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setIsModalOpen(true);
    };

    const handleDeleteDoctor = async (id) => {
        setDeleteDoctorId(id)
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            const response = await axios.delete(`https://localhost:7137/api/Doctor/Delete/${deleteDoctorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchDoctorList();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting item:', error.message);
            if (error.response.data.includes("Selected record exists in Patients")) {
                setInUseError(true);
            }
        }
    };



    const handleChange = useCallback((name, args) => {
        // const { name, value } = args;
        console.log("args", name, args)
        setDoctor(prevState => ({
            ...prevState,
            [name]: args
        }));

    }, []);


    const handleSpecialtyChange = useCallback((args) => {
        setDoctor((prevDoctor) => ({
            ...prevDoctor,
            SpecialityID: args.value
        }));
    }, []);


    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
        setInUseError(false)
    };



    const formattedSpecialtyOptions = specialtiesList.map(specialty => ({
        Name: specialty.SpecialityName,
        ID: specialty.SpecialityID
    }));

    const [loadPanelVisible, setLoadPanelVisible] = useState(false);




 


    return (
        <React.Fragment>
            <h2 className={'content-block'}>Doctor List</h2>
            <div className="w-100 d-flex justify-content-end my-2" >
                <Button variant="primary" onClick={handleAddClick}>Add</Button>
            </div>
            <LoadPanel
                shadingColor="rgba(0,0,0,0.4)"
                visible={loadPanelVisible}
            />
            <DataGrid
                id="dataGrid"
                allowColumnReordering={true}
                dataSource={doctorsList}
                showBorders={true}
            >
                <Paging defaultPageSize={10} />
                <Pager showPageSizeSelector={true} showInfo={true} />
     

                <Grouping autoExpandAll={true} />
                <GroupPanel visible={true} /> 
                <Sorting mode="multiple" />
                <FilterRow visible={true} />
                <HeaderFilter visible={true} allowSearch="true" />
                <Column dataField="DoctorName" caption="Doctor Name"
                    minWidth={250}
                >
                   
                </Column>
                <Column dataField="SpecialityID" caption='Speciality Name' minWidth={250}>
                    <Lookup
                        dataSource={formattedSpecialtyOptions}
                        displayExpr="Name"
                        valueExpr="ID"
                    />
                </Column>
                <Column dataField="Education" caption='Education'

                    minWidth={250}
                >
   
                </Column>
                <Column type='buttons' minWidth={100} >
                    <GridButton
                        text="Edit"
                        icon="edit"
                        onClick={(row) => handleEditDoctor(row.row.data)}
                    />
                    <GridButton
                        text="Delete"
                        icon="trash"
                        onClick={(row) => handleDeleteDoctor(row.row.data.DoctorID)}
                    />

                </Column>
       
            </DataGrid>
 
            {isModalOpen && <DoctorModal
                show={isModalOpen}
                handleClose={handleCloseModal}
                handleSave={handleSaveDoctor}
                selectedDoctor={selectedDoctor}
                doctor={doctor}
                handleChange={handleChange}
                setDoctor={setDoctor}
                specialtiesList={specialtiesList}
                handleSpecialtyChange={handleSpecialtyChange}
            />}

            <DeleteConfirmationModal
                show={isDeleteModalOpen}
                handleClose={handleDeleteModalClose}
                handleDelete={handleDeleteConfirmed}
                deleteMessage={deleteMessage}
                inUseError={inUseError}
            />
        </React.Fragment>
    );
};

export default DoctorList;
