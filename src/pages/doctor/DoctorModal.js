import React, { useState, useEffect } from 'react';
import { SelectBox } from 'devextreme-react/select-box';
import Validator, { RequiredRule,AsyncRule } from 'devextreme-react/validator';
import Button from 'devextreme-react/button';
import TextBox from 'devextreme-react/text-box';
import { Popup } from 'devextreme-react/popup';
import axios from 'axios';


const DoctorModal = ({ show, handleClose, handleSave, selectedDoctor, doctor, handleChange, setDoctor, specialtiesList, handleSpecialtyChange, darkMode, duplicateError }) => {
    const token = localStorage.getItem("token");
    useEffect(() => {
        debugger
        console.log("selectedDoctor", selectedDoctor)
        if (selectedDoctor) {
            setDoctor({
                ...doctor,
                DoctorName: selectedDoctor.DoctorName,
                SpecialityID: selectedDoctor.SpecialityID,
                Education: selectedDoctor.Education,
            })
        }
        console.log("doctor", doctor)
    }, [selectedDoctor]);

    const formattedSpecialtyOptions = specialtiesList.map(specialty => ({
        Name: specialty.SpecialityName,
        ID: specialty.SpecialityID
    }));

    console.log("formattedSpecialtyOptions", formattedSpecialtyOptions)
    console.log("first", doctor)

    async function sendRequest(value) {
        if(!selectedDoctor){
        try {
            const response = await axios.get(`https://localhost:7137/api/Doctor/CheckDuplicateDoctorName/${value}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.status == 200){
                return true
            }else{
                return false;
            }
        } catch (error) {
            console.error('Error checking duplicate item name:', error);
            return false;
        }
    }else{
        
        if(selectedDoctor.DoctorName == value){
            return true
        }else{
            try {
                const response = await axios.get(`https://localhost:7137/api/Doctor/CheckDuplicateDoctorName/${value}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.status == 200){
                    return true
                }else{
                    return false;
                }
            } catch (error) {
                console.error('Error checking duplicate item name:', error);
                return false;
            }
        }
    }
    }



    function asyncValidation(params) {
        debugger
        return sendRequest(params.value);
    }


    return (
        <div>
            <Popup
                visible={show}
                onHiding={handleClose}
                dragEnabled={false}
                hideOnOutsideClick={true}
                showCloseButton={true}
                showTitle={true}
                title={selectedDoctor ? 'Edit Doctor' : 'Add Doctor'}
                // container=".dx-viewport"
                maxWidth={500}
                maxHeight={340}
            >
                
                <form onSubmit={handleSave}>
                    <div className='d-flex flex-column gap-2'>
                        <TextBox
                            name='DoctorName'
                            label="Doctor Name"
                            labelMode="floating"
                            placeholder="Enter Doctor Name"
                            value={doctor?.DoctorName}
                            onValueChange={(e) => handleChange("DoctorName", e)}
                            valueChangeEvent="input"
                            maxLength={20}
                            showClearButton={true}
                            validationMessagePosition="down"
                        >
                            <Validator>
                                <RequiredRule message="Doctor Name is required" />
                                <AsyncRule
                                    message="Item Already Exist"
                                    validationCallback={asyncValidation}
                                />
                            </Validator>
                        </TextBox>
                        <SelectBox
                            searchEnabled={true}
                            dataSource={formattedSpecialtyOptions}
                            displayExpr={"Name"}
                            valueExpr={"ID"}
                            value={
                                doctor.SpecialityID
                            }
                            onValueChanged={handleSpecialtyChange}
                            // elementAttr={selectBoxAttributes}
                            showDropDownButton={true}
                            label="Specialty"
                            labelMode="floating"
                            validationMessagePosition="down"
                        >
                            <Validator>
                                <RequiredRule message="Please Select the Specialty" />
                            </Validator>
                        </SelectBox>
                        <TextBox
                            label="Education"
                            labelMode="floating"
                            placeholder="Enter Education"
                            value={doctor?.Education}
                            onValueChange={(e) => handleChange("Education", e)}
                            valueChangeEvent="input"
                            maxLength={20}
                            showClearButton={true}
                            validationMessagePosition="down"
                        >
                            <Validator>
                                <RequiredRule message="Education is required" />
                            </Validator>
                        </TextBox>
                        </div>
                <div className='d-flex justify-content-end gap-2 mt-4'>
                    <Button onClick={handleClose}>Close</Button>
                    <Button
                        text="Contained"
                        type="default"
                        stylingMode="contained"
                        useSubmitBehavior={true} >{selectedDoctor ? 'Update' : 'Save'}</Button>
                </div>
                </form>
            </Popup>
        </div>
    );
};

export default DoctorModal;
