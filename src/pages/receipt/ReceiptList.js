import React, { useCallback, useEffect, useState } from "react";
import { Button } from "devextreme-react";
import ReceiptModal from "./ReceiptModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DeleteConfirmationModal } from '../../components';
import DataGrid, { Column, Button as GridButton, GroupPanel, Sorting, FilterRow, HeaderFilter,Paging, Pager } from 'devextreme-react/data-grid';
import { LoadPanel } from 'devextreme-react/load-panel';
import moment from "moment";

const ReceiptList = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [receipts, setReceipts] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [itemList, setItemList] = useState([]);
    const [deleteReceiptId, setDeleteReceiptId] = useState(null);
    const [loadPanelVisible, setLoadPanelVisible] = useState(false);

    const initialData = {
        receiptID: 0,
        receiptNo: `${new Date().getFullYear()}${Math.floor(
            Math.random() * 10000
        )}`,
        personName: "",
        receiptDate: "",
        doctorID: 14,
        netAmount: 0,
        remarks: "",
        receiptDetail: [
            {
                receiptDetailID: 0,
                receiptID: 0,
                itemID: 0,
                quantity: "",
                rate: "",
                discount: 0,
                amount: 0,
                itemName: "",
                unit: "",
                grossAmount: 0,
                discountPercent: "",
            },
        ],
    }

    const [receiptData, setReceiptData] = useState(initialData);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const deleteMessage = "Are you sure you want to delete this Receipt?"

    useEffect(() => {
        if (!token) {
            navigate('/')
        }
    }, [])


    const fetchReceiptList = async () => {
        setLoadPanelVisible(true)
        try {
            const response = await axios.get(
                "https://localhost:7137/api/Receipt/GetList",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const receiptList = response.data;
            setReceipts(receiptList);
            setLoadPanelVisible(false)
            console.log("Receipt list:", receiptList);
        } catch (error) {
            console.error("Error fetching receipt list:", error.message);
            setLoadPanelVisible(false)
        }
    };

    const fetchItemsList = async () => {
        try {
            const response = await axios.get('https://localhost:7137/api/Item/GetLookupList', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const itemList = response.data;
            console.log('Item list:', itemList);
            setItemList(itemList)
        } catch (error) {
            console.error('Error fetching item list:', error.message);
        }
    }

    useEffect(() => {
        fetchReceiptList();
        fetchItemsList();
    }, []);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedReceipt(null);
        setReceiptData(initialData)
    };

    const handleAddClick = () => {
        setSelectedReceipt(null);
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {

        debugger;
        e.preventDefault();
        if (selectedReceipt) {
            const extractReceiptDetailItems = () => {
                const extractedItems = receiptData.receiptDetail.map((detail) => ({
                    receiptDetailID: detail.receiptDetailID,
                    receiptID: detail.receiptID,
                    itemID: detail.itemID,
                    quantity: parseInt(detail.quantity),
                    rate: parseInt(detail.rate),
                    discount: parseInt(detail.discountPercent),
                    amount: detail.amount,
                }));

                return extractedItems;
            };
            const extractedItems = extractReceiptDetailItems();
            const updatedReceiptData = {
                receiptID: selectedReceipt.receiptID,
                receiptNo: parseInt(receiptData.receiptNo),
                receiptDate: receiptData.receiptDate,
                doctorID: 14,
                netAmount: parseInt(receiptData.netAmount),
                remarks: receiptData.remarks,
                receiptDetail: extractedItems,
            };
            try {
                const response = await axios.put(
                    `https://localhost:7137/api/Receipt/Update/`,
                    updatedReceiptData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                const data = response.data;
                console.log("Receipt updated successfully:");
                setReceiptData(initialData)
                fetchReceiptList();

            } catch (error) {
                console.error("Error updating receipt:", error.message);

            }
        } else {
            
            const extractReceiptDetailItems = () => {
                const extractedItems = receiptData.receiptDetail.map((detail) => ({
                    receiptDetailID: detail.receiptDetailID,
                    receiptID: detail.receiptID,
                    itemID: detail.itemID,
                    quantity: parseInt(detail.quantity),
                    rate: parseInt(detail.rate),
                    discount: parseInt(detail.discountPercent),
                    amount: detail.amount,
                }));

                return extractedItems;
            };
            const extractedItems = extractReceiptDetailItems();

            const receiptAddData = {
                receiptID: 0,
                receiptNo: parseInt(receiptData.receiptNo),
                receiptDate: receiptData.receiptDate,
                doctorID: 14,
                netAmount: parseInt(receiptData.netAmount),
                remarks: receiptData.remarks,
                receiptDetail: extractedItems,
            };

            try {
                const response = await axios.post(
                    "https://localhost:7137/api/Receipt/Insert",
                    receiptAddData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                const data = response.data;
                console.log("Receipt inserted successfully:", data);
                setReceiptData(initialData)

                fetchReceiptList();
            } catch (error) {
                console.error("Error inserting receipt:", error.message);
                throw error;
            }
        }
        handleCloseModal();
    };

    const fetchReceiptById = async (receiptId) => {
        try {
            const response = await axios.get(
                `https://localhost:7137/api/Receipt/GetById/${receiptId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const receiptData = response.data;
            setSelectedReceipt({ ...receiptData, receiptID: receiptId });
            console.log("Receiptby id data:", receiptData);
        } catch (error) {
            console.error("Error fetching receipt data:", error.message);
        }
    };

    const handleEditClick = (receipt) => {
        console.log("id recdeipt", receipt.ReceiptID);
        fetchReceiptById(receipt.ReceiptID);

        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        setDeleteReceiptId(id)
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            const response = await axios.delete(`https://localhost:7137/api/Receipt/Delete/${deleteReceiptId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchReceiptList();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting item:', error.message);
        }
    };


    const handleDateChange = useCallback((args) => {
        setReceiptData((prevApp) => ({
            ...prevApp,
            receiptDate: args.value
        }));
    }, []);

    const handleChange = useCallback((name, value) => {
        setReceiptData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, []);

    const formatReceiptDate = (receiptDate) => {
        return moment(receiptDate).format('YYYY-MM-DD')
    };

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
    };

    return (
        <React.Fragment>
            <h2 className={'content-block'}>Receipt List</h2>
            <LoadPanel
                shadingColor="rgba(0,0,0,0.4)"
                visible={loadPanelVisible}
            />
            <div className="w-100 d-flex justify-content-end">
                <Button variant="primary" onClick={handleAddClick}>
                    Add
                </Button>
            </div>
            <DataGrid
                dataSource={receipts}
                showBorders={true}
                width="100%"
            >
                <Paging defaultPageSize={10} />
                <Pager showPageSizeSelector={true} showInfo={true} />
                <GroupPanel visible={true} />
                <Sorting mode='multiple' />
                <FilterRow visible={true} />
                <HeaderFilter visible={true} allowSearch="true" />
                <Column dataField='ReceiptNo' caption='Receipt No' minWidth={150} alignment="left"  />
                <Column dataField='ReceiptDate' caption='Receipt Date' minWidth={150} cellRender={data => formatReceiptDate(data.data.ReceiptDate)} dataType="date"></Column>
                <Column dataField='NetAmount' caption='Net Amount' minWidth={250} alignment="left" />
                <Column dataField='Remarks' caption='Remarks' minWidth={300}></Column>
                <Column type='buttons' minWidth={250}>
                    <GridButton text='Edit' icon='edit' onClick={(row) => handleEditClick(row.row.data)} />
                    <GridButton text='Delete' icon='trash' onClick={(row) => handleDeleteClick(row.row.data.ReceiptID)} />
                </Column>
            </DataGrid>
            {isModalOpen &&
                <ReceiptModal
                    show={isModalOpen}
                    handleClose={handleCloseModal}
                    handleSave={handleSave}
                    selectedReceipt={selectedReceipt}
                    receiptData={receiptData}
                    setReceiptData={setReceiptData}
                    handleDateChange={handleDateChange}
                    handleChange={handleChange}
                    itemList={itemList}
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

export default ReceiptList;