import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'devextreme-react';
import ItemModal from './ItemModal';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { DeleteConfirmationModal } from '../../components';
import DataGrid, {
    Column, Button as GridButton, FilterRow, Pager,
    Paging,
} from 'devextreme-react/data-grid';
import { LoadPanel } from 'devextreme-react/load-panel';
import 'devextreme/data/odata/store';

const ItemList = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemsList, setItemsList] = useState([]);
    const initialData = {
        itemName: ""
    }
    const [item, setItem] = useState(initialData);
    // const initialError = {
    //     itemName: false
    // }
    // const [itemError, setItemError] = useState(initialError)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const deleteMessage = "Are you sure you want to delete this item?"
    // const [duplicateError, setDuplicateError] = useState(false)
    const [inUseError, setInUseError] = useState(false)
    const [loadPanelVisible, setLoadPanelVisible] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/')
        }
    }, [])

    const getItemsList = async () => {
        setLoadPanelVisible(true)
        try {
            setTimeout(async () => {
                const response = await axios.get('https://localhost:7137/api/Item/GetList', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = response.data;
                setItemsList(data)
                setLoadPanelVisible(false)

            }, 500)


        } catch (error) {
            console.error('Error fetching data:', error.message);
            setLoadPanelVisible(false)
        }
    }

    useEffect(() => {
        getItemsList();
    }, [])

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        // setItemError(initialData)
        setItem(initialData)
        // setDuplicateError(false)
    };

    const handleAddClick = () => {
        setIsModalOpen(true);
    };

    // const validateItem = () => {

    //     let hasError = false;
    //     const newErrors = {};

    //     for (const key in item) {
    //         if (!item[key]) {
    //             newErrors[key] = true;
    //             hasError = true;
    //         } else {
    //             newErrors[key] = false;
    //         }
    //     }

    //     setItemError(newErrors);

    //     return hasError;
    // };

    const handleSave = async (e) => {
        e.preventDefault();
        // if (validateItem()) {
        //     return;
        // }
        if (selectedItem) {
            const updatedItemData = {
                itemID: selectedItem.ItemID,
                itemName: item.itemName
            };

            try {

                await axios.put(`https://localhost:7137/api/Item/Update/`, updatedItemData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                handleCloseModal();
                getItemsList();
            } catch (error) {
                console.error('Error updating item:', error.message);
                if (error.response.data.includes("Cannot accept duplicate item name")) {
                    // setDuplicateError(true);
                }
            }
        } else {
            // Add new item

            const newItem = { ItemName: item.itemName };
            try {

                const response = await axios.post('https://localhost:7137/api/Item/Insert', newItem, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Item inserted successfully', response);

                getItemsList();

                handleCloseModal();
            } catch (error) {
                console.error(error.response.data);
                if (error.response.data.includes("Cannot accept duplicate item name")) {
                    // setDuplicateError(true);

                }

            }
        }

    };

    const handleEditClick = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (itemId) => {
        setDeleteItemId(itemId)
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirmed = async () => {

        try {
            await axios.delete(`https://localhost:7137/api/Item/Delete/${deleteItemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            getItemsList();
            setIsDeleteModalOpen(false);

        } catch (error) {
            console.error('Error deleting item:', error.message);
            if (error.response.data.includes("The statement has been terminated")) {
                setInUseError(true);
            }
        }

    };

    const handleChange = useCallback((name, args) => {
        // const { name, value } = args;
        console.log("args", name, args)
        setItem(prevState => ({
            ...prevState,
            [name]: args
        }));
    }, []);

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
        setInUseError(false)
    };
    console.log("itemList", itemsList)



    // async function sendBatchRequest(url, changes) {
    //     debugger
    //     console.log("chnages", changes[0].data, url)
    //     const updatedItemData = {
    //         ...changes[0].key, ...changes[0].data
    //     }
    //     const finalData = {
    //         itemID: updatedItemData.ItemID,
    //         itemName: updatedItemData.ItemName
    //     };
    //     console.log("FinalDoctorData", finalData)
    //     try {
    //         const response = await axios.put(`${url}`, finalData, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         getItemsList();
    //     } catch (error) {
    //         console.error('Error updating doctor:', error.message);
    //     }
    // }
    // async function processBatchRequest(url, changes, component) {
    //     debugger
    //     console.log("promiseBatch", changes, component)
    //     await sendBatchRequest(url, changes);
    //     await component.refresh(true);
    //     component.cancelEditData();
    // }
    // const onSaving = (e) => {
    //     debugger
    //     console.log("eChanges", e)
    //     e.cancel = true;
    //     if (e.changes.length) {
    //         e.promise = processBatchRequest(`${"https://localhost:7137/api/Item/Update/"}`, e.changes, e.component);
    //     }
    // };


    return (
        <React.Fragment>
            <h2 className={'content-block'}>Items</h2>
            <div className="w-100 d-flex justify-content-end">
                <Button variant="primary" onClick={handleAddClick}>Add</Button>
            </div>
            <LoadPanel
                shadingColor="rgba(0,0,0,0.4)"
                // onHiding={hideLoadPanel}
                visible={loadPanelVisible}
            // hideOnOutsideClick={hideOnOutsideClick}
            />

            <DataGrid
                dataSource={itemsList}
                showBorders={true}
            // focusedRowEnabled={true}
            // defaultFocusedRowIndex={0}
            // columnAutoWidth={true}
            // columnHidingEnabled={true}
            >
                <Paging defaultPageSize={10} />
                <Pager showPageSizeSelector={true} showInfo={true} />
                <FilterRow visible={true} />


                <Column
                    dataField={'ItemName'}
                    caption={'Item Name'}
                    // hidingPriority={1}
                    minWidth={250}
                />
                <Column type='buttons' >
                    <GridButton text='Edit' icon='edit' onClick={(row) => handleEditClick(row.row.data)} />
                    <GridButton text='Delete' icon='trash' onClick={(row) => handleDeleteClick(row.row.data.ItemID)} />
                </Column>
            </DataGrid>
            {isModalOpen && <ItemModal
                show={isModalOpen}
                handleClose={handleCloseModal}
                handleSave={handleSave}
                selectedItem={selectedItem}
                item={item}
                setItem={setItem}
                handleChange={handleChange}
            // itemError={itemError}
            // darkMode={darkMode}
            // duplicateError={duplicateError}
            />}
            <DeleteConfirmationModal
                show={isDeleteModalOpen}
                handleClose={handleDeleteModalClose}
                handleDelete={handleDeleteConfirmed}
                deleteMessage={deleteMessage}
                // darkMode={darkMode}
                inUseError={inUseError}
            />
        </React.Fragment>
    );
};

export default ItemList;