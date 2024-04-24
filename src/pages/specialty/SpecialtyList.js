import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'devextreme-react';
import SpecialtyModal from './SpecialtyModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DeleteConfirmationModal } from '../../components';
import DataGrid, { Column, Button as GridButton,  Sorting, FilterRow, Pager, Paging } from 'devextreme-react/data-grid';
import { LoadPanel } from 'devextreme-react/load-panel';
import { getAPI, postAPI, putAPI } from '../../services';

const SpecialtyList = ({ darkMode }) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [specialties, setSpecialties] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const initialData = {
        SpecialityName: '',
        Description: ''
    }
    const [speciality, setSpeciality] = useState(initialData);
    const [deleteSpecialtyId, setDeleteSpecialtyId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [inUseError, setInUseError] = useState(false)
    const deleteMessage = "Are you sure you want to delete this Specialty?"
    const [loadPanelVisible, setLoadPanelVisible] = useState(false);
 
   useEffect(() => {
        if (!token) {
            navigate('/')
        }
    }, [])

    const getSpecialityList = async () => {
        setLoadPanelVisible(true)
        try {
            const apiUrl = 'https://localhost:7137/api/Speciality/GetList';
            const responseData = await getAPI(apiUrl, token);
            setSpecialties(responseData)
            setLoadPanelVisible(false)
        } catch (error) {
            console.error('Error:', error.message);
            setLoadPanelVisible(false)
        }
    }

    useEffect(() => {
        getSpecialityList();
    }, [])

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSpecialty(null);
        setSpeciality(initialData)
    };

    const handleAddClick = () => {
        setIsModalOpen(true);
    };


    const handleSave = async (e) => {
        e.preventDefault();
        if (selectedSpecialty) {
            const updatedData = {

                specialityID: selectedSpecialty?.SpecialityID,
                specialityName: speciality?.SpecialityName,
                isGynac: false,
                description: speciality?.Description

            }
            try {
                const apiUrl = 'https://localhost:7137/api/Speciality/Update/';
                await putAPI(apiUrl, updatedData, token);
                getSpecialityList();
                handleCloseModal();
            } catch (error) {
                console.error('Error:', error.message);
            }

        } else {
            const data = {
                "specialityName": speciality.SpecialityName,
                "description": speciality.Description
            }

            try {
                const apiUrl = 'https://localhost:7137/api/Speciality/Insert';
                await postAPI(apiUrl, data, token);
                getSpecialityList();
                handleCloseModal();
            } catch (error) {
                console.error('Error:', error.message);
            }
        }


    };

    const handleEditClick = (specialt) => {
        setSelectedSpecialty(specialt);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        setDeleteSpecialtyId(id)
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            await axios.delete(`https://localhost:7137/api/Speciality/Delete/${deleteSpecialtyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            getSpecialityList();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting item:', error.response.data);
            if (error.response.data.includes("Selected record exists in Doctors.")) {
                setInUseError(true)
            }

        }
    };

    const handleChange = useCallback((name, value) => {
        setSpeciality(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, []);

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
        setInUseError(false)
    };


    return (
        <React.Fragment>
            <LoadPanel
                shadingColor="rgba(0,0,0,0.4)"
                visible={loadPanelVisible}
            />
            <h2 className={'content-block'}>Specialty List</h2>
            <div className="w-100 d-flex justify-content-end">
                <Button variant="primary" onClick={handleAddClick}>
                    Add
                </Button>
            </div>
            <DataGrid
                dataSource={specialties}
            >
                <Paging defaultPageSize={5} />
                <Pager showPageSizeSelector={true} showInfo={true} />
                <Sorting mode='single' />
                <FilterRow visible={true} />
                <Column dataField='SpecialityName' caption='Speciality Name' minWidth={200} >
                </Column>
                <Column type='buttons'
                >
                    <GridButton text='Edit' icon='edit' onClick={(row) => handleEditClick(row.row.data)} />
                    <GridButton text='Delete' icon='trash' onClick={(row) => handleDeleteClick(row.row.data.SpecialityID)} />
                </Column>
            </DataGrid>

            {isModalOpen && <SpecialtyModal
                show={isModalOpen}
                handleClose={handleCloseModal}
                handleSave={handleSave}
                handleChange={handleChange}
                speciality={speciality}
                selectedSpecialty={selectedSpecialty}
                setSpeciality={setSpeciality}
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

export default SpecialtyList;