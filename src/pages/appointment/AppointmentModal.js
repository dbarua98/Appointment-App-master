import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from "axios"
import { Popup } from 'devextreme-react/popup';
import TextBox from 'devextreme-react/text-box';
import { SelectBox } from 'devextreme-react/select-box';
import { NumberBox } from 'devextreme-react/number-box';
import { Button } from 'devextreme-react/button';

import {
    Validator,
    RequiredRule,
    CompareRule,
    EmailRule,
    PatternRule,
    StringLengthRule,
    RangeRule,
    AsyncRule,
} from 'devextreme-react/validator';
import DateBox from 'devextreme-react/date-box';

const AppointmentModal = ({ show, handleClose, handleSave, selectedAppointment, handleChange, patientAppointment, handleDateChange, handleDoctorChange, handleSpecialtyChange, stateList, handleStateChange, cityList, handleCityChange, setPatientAppointment, patientAppointmentError, darkMode, mobileValid, handleGenderChange, handleMaritalStatusChange, onDateTimeValueChanged, onDateValueChanged }) => {
    const token = localStorage.getItem("token");
    const [specialtiesList, setSpecialtiesList] = useState([]);
    const [doctorsList, setDoctorsList] = useState([]);
    const [filterDoctor, setFilterDoctor] = useState([]);
    const dateTimeLabel = { 'aria-label': 'Date Time' };
    const now = new Date();
    const [value, setValue] = useState(new Date(1981, 3, 27));

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

    const fetchDoctorList = async () => {
        try {
            const response = await axios.get('https://localhost:7137/api/Doctor/GetLookupList', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const doctorList = response.data;
            setDoctorsList(doctorList)
            console.log('Doctor list:', doctorList);
        } catch (error) {
            console.error('Error fetching doctor list:', error.message);
        }
    }

    useEffect(() => {
        fetchSpecialtyList();
        fetchDoctorList();
    }, [])

    useEffect(() => {
        let filterDoctor = doctorsList.filter(doctor => doctor.SpecialityID === parseInt(patientAppointment.specialityID));
        setFilterDoctor(filterDoctor)
    }, [patientAppointment.specialityID, doctorsList])

    useEffect(() => {
        if (selectedAppointment) {
            setPatientAppointment({
                ...patientAppointment,
                appointmentID: selectedAppointment.AppointmentID,
                appointmentDateTime: selectedAppointment.AppointmentDateTime,
                firstName: selectedAppointment.FirstName,
                lastName: selectedAppointment.LastName,
                fullName: selectedAppointment.FullName,
                dob: selectedAppointment.DOB,
                gender: selectedAppointment.Gender,
                mobileNo: selectedAppointment.MobileNo,
                maritalStatus: selectedAppointment.MaritalStatus,
                address: selectedAppointment.Address,
                stateID: selectedAppointment.StateID,
                cityID: selectedAppointment.CityID,
                reasonForAppointment: selectedAppointment.ReasonForAppointment,
                specialityID: selectedAppointment.SpecialityID,
                doctorID: selectedAppointment.DoctorID
            })
        }


    }, [selectedAppointment, patientAppointment.appointmentID]);
    console.log("last", patientAppointment)

    const formattedDoctorOptions = filterDoctor.map(doctor => ({
        Name: doctor.DoctorName,
        ID: doctor.DoctorID
    }));

    const formattedSpecialtyOptions = specialtiesList.map(specialty => ({
        Name: specialty.SpecialityName,
        ID: specialty.SpecialityID
    }));

    const formattedStateOptions = stateList.map(state => ({
        Name: state.StateName,
        ID: state.StateID
    }));

    const formattedCityOptions = cityList.map(city => ({
        Name: city.CityName,
        ID: city.CityID
    }));

    const genderOptions = [
        { ID: 0, Name: 'Male' },
        { ID: 1, Name: 'Female' },
        { ID: 2, Name: 'Others' }
    ]
    const maritalStatusOptions = [
        { ID: 0, Name: 'Married' },
        { ID: 1, Name: 'UnMarried' },
    ]
    // const inputStyle = darkMode ? darkModeStyle : lightModeStyle;

    // const customStyles = {
    //     control: provided => ({
    //         ...provided,
    //         backgroundColor: darkMode ? 'bg-dark' : 'bg-light', // Change background color based on darkMode

    //     }),
    //     option: (provided, state) => ({
    //         ...provided,
    //         backgroundColor: state.isSelected ? (darkMode ? '#333' : '#007bff') : (darkMode ? '#000' : '#fff'),
    //         color: state.isSelected ? '#fff' : (darkMode ? '#fff' : '#000'),
    //     }),
    //     singleValue: provided => ({
    //         ...provided,
    //         color: darkMode ? '#fff' : '#000', // Change text color of the selected value based on darkMode
    //     }),
    // };

    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 10);

    const onValueChanged = useCallback((e) => {
        console.log("dateandTimeChange", e)
        setValue(e.value);
    }, []);


    const [dateValue, setDateValue] = useState(new Date());

    // const dateBoxAttributes = useMemo(() => ({
    //     id: 'elementId',
    //     class: 'class-name'
    // }), []);

    // const onDateTimeValueChanged = useCallback((args) => {
    //     // setDateValue(args.value);
    //     setPatientAppointment({ ...patientAppointment, appointmentDateTime: args.value })
    // }, []);

    const min = new Date(1900, 0, 1);
    const max = new Date();



    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
    console.log("dateValue", patientAppointment)
    return (
        <Popup
            visible={show}
            onHiding={handleClose}
            dragEnabled={false}
            hideOnOutsideClick={true}
            showCloseButton={true}
            showTitle={true}
            title={selectedAppointment ? 'Edit Appointment' : 'Add Appointment'}
            // container=".dx-viewport"
            maxWidth={600}
            maxHeight={550}
        >

            <form onSubmit={handleSave}>
                <DateBox
                    type="datetime"
                    defaultValue={now}
                    value={patientAppointment.appointmentDateTime}
                    min={min}
                    // max={now}
                    // elementAttr={dateBoxAttributes}
                    maxLength={50}
                    label="Date and Time"
                    labelMode="floating"
                    onValueChanged={onDateTimeValueChanged}
                    validationMessagePosition="down"
                    pickerType={"calendar"}
                    // displayFormat={"shortdate"}
                    useMaskBehavior={true}
                />
                <div className='d-md-flex my-2 gap-2'>
                    <TextBox
                        name='firstName'
                        label='First Name'
                        labelMode='floating'
                        placeholder='Enter First Name'
                        value={patientAppointment.firstName}
                        onValueChange={(e) => handleChange("firstName", e)}
                        valueChangeEvent='input'
                        showClearButton={true}
                        maxLength={20}
                        validationMessagePosition='down'
                    >
                        <Validator>
                            <RequiredRule message='Please Enter First Name' />
                        </Validator>
                    </TextBox>

                    <TextBox
                        name='lastName'
                        label='Last Name'
                        labelMode='floating'
                        placeholder='Enter Last Name'
                        value={patientAppointment.lastName}
                        onValueChange={(e) => handleChange("lastName", e)}
                        valueChangeEvent='input'
                        showClearButton={true}
                        maxLength={20}
                        validationMessagePosition='down'
                    >
                        <Validator>
                            <RequiredRule message='Please Enter Last Name' />
                        </Validator>
                    </TextBox>
                    <TextBox
                        name='fullName'
                        label='Full Name'
                        labelMode='floating'
                        placeholder='Enter Full Name'
                        value={patientAppointment.fullName}
                        onValueChange={(e) => handleChange("fullName", e)}
                        valueChangeEvent='input'
                        showClearButton={true}
                        maxLength={20}
                        validationMessagePosition='down'
                    >
                        <Validator>
                            <RequiredRule message='Please Enter Full Name' />
                        </Validator>
                    </TextBox>
                </div>
                <div className='d-md-flex my-2 gap-2'>
                <DateBox
                    type="date"
                    // defaultValue={tenYearsAgo}
                    value={patientAppointment.dob}
                    // min={tenYearsAgo}
                    max={tenYearsAgo}
                    // elementAttr={dateBoxAttributes}
                    maxLength={50}
                    label="DOB"
                    labelMode="floating"
                    onValueChanged={onDateValueChanged}
                    validationMessagePosition="down"
                    pickerType={"calendar"}
                    // displayFormat={"shortdate"}
                    useMaskBehavior={true}
                />

                <SelectBox
                    searchEnabled={true}
                    dataSource={genderOptions}
                    displayExpr={"Name"}
                    valueExpr={"ID"}
                    value={
                        patientAppointment.gender
                    }
                    onValueChanged={handleGenderChange}
                    showDropDownButton={true}
                    label="Gender"
                    labelMode="floating"
                    validationMessagePosition="down"
                >
                    <Validator>
                        <RequiredRule message="Please Select the Gender" />
                    </Validator>
                </SelectBox>

                <NumberBox
                    name='mobileNo'
                    mode="tel"
                    min={0}
                    step={0}
                    // format={{ type:'decimal', precision:1}}
                    value={patientAppointment?.mobileNo}
                    // elementAttr={numberBoxAttributes}
                    maxLength={10}
                    // minLength={10}
                    valueChangeEvent='input'
                    label='Mobile Number'
                    labelMode='floating'
                    onValueChange={(e) => handleChange("mobileNo", e)}
                    validationMessagePosition='bottom'
                >
                    <Validator>
                        <RequiredRule message="Mobile Number is Required" />
                        <StringLengthRule min={10} max={10} message="Mobile number must be 10 digits" />
                    </Validator>
                </NumberBox>

                <SelectBox
                    searchEnabled={true}
                    dataSource={maritalStatusOptions}
                    displayExpr={"Name"}
                    valueExpr={"ID"}
                    value={
                        patientAppointment.maritalStatus
                    }
                    onValueChanged={handleMaritalStatusChange}
                    showDropDownButton={true}
                    label="Marital Status"
                    labelMode="floating"
                    validationMessagePosition="down"
                >
                    <Validator>
                        <RequiredRule message="Please Select the Marital Status" />
                    </Validator>
                </SelectBox>
                </div>
                <div className='d-md-flex my-2 gap-2'>
                <TextBox
                    name='address'
                    label='Address'
                    labelMode='floating'
                    placeholder='Enter Address'
                    value={patientAppointment.address}
                    onValueChange={(e) => handleChange("address", e)}
                    valueChangeEvent='input'
                    showClearButton={true}
                    maxLength={20}
                    validationMessagePosition='down'
                >
                    <Validator>
                        <RequiredRule message='Please Enter Address' />
                    </Validator>
                </TextBox>
                    
                <SelectBox
                    searchEnabled={true}
                    dataSource={formattedStateOptions}
                    displayExpr={"Name"}
                    valueExpr={"ID"}
                    value={
                        patientAppointment.stateID
                    }
                    onValueChanged={handleStateChange}
                    showDropDownButton={true}
                    label="State"
                    labelMode="floating"
                    validationMessagePosition="down"
                >
                    <Validator>
                        <RequiredRule message="Please Select the State" />
                    </Validator>
                </SelectBox>

                <SelectBox
                    searchEnabled={true}
                    dataSource={formattedCityOptions}
                    displayExpr={"Name"}
                    valueExpr={"ID"}
                    value={
                        patientAppointment.cityID
                    }
                    onValueChanged={handleCityChange}
                    showDropDownButton={true}
                    label="City"
                    labelMode="floating"
                    validationMessagePosition="down"
                >
                    <Validator>
                        <RequiredRule message="Please Select the City" />
                    </Validator>
                </SelectBox>
                </div>
                <TextBox
                    name='reasonForAppointment'
                    label='Reason For Appointment'
                    labelMode='floating'
                    placeholder='Reason For Appointment'
                    value={patientAppointment.reasonForAppointment}
                    onValueChange={(e) => handleChange("reasonForAppointment", e)}
                    valueChangeEvent='input'
                    showClearButton={true}
                    maxLength={20}
                    validationMessagePosition='down'
                >
                    <Validator>
                        <RequiredRule message='Please Enter Reason For Appointment' />
                    </Validator>
                </TextBox>
                    <div className='d-flex my-2 justify-content-between gap-2'>
                <SelectBox
                className='w-100'
                //  style={{with:"50%"}}
                    searchEnabled={true}
                    dataSource={formattedSpecialtyOptions}
                    displayExpr={"Name"}
                    valueExpr={"ID"}
                    value={
                        patientAppointment.specialityID
                    }
                    onValueChanged={handleSpecialtyChange}
                    showDropDownButton={true}
                    label="Speciality"
                    labelMode="floating"
                    validationMessagePosition="down"
                >
                    <Validator>
                        <RequiredRule message="Please Select the Speciality" />
                    </Validator>
                </SelectBox>
                <SelectBox
                className='w-100'
                    searchEnabled={true}
                    dataSource={formattedDoctorOptions}
                    displayExpr={"Name"}
                    valueExpr={"ID"}
                    value={
                        patientAppointment.doctorID
                    }
                    onValueChanged={handleDoctorChange}
                    showDropDownButton={true}
                    label="Doctor"
                    labelMode="floating"
                    validationMessagePosition="down"
                >
                    <Validator>
                        <RequiredRule message="Please Select the Doctor" />
                    </Validator>
                </SelectBox>
                </div>
                <div className='d-flex justify-content-end gap-2 mt-3'>
                    <Button
                        text="Cancel"
                        type="normal"
                        stylingMode="outlined"
                        onClick={handleClose}
                    />
                    <Button
                        useSubmitBehavior={true}
                        text={selectedAppointment?"Update":"Save"}
                        type="default"
                        stylingMode="contained"
                    />
                </div>
            </form>

        </Popup>
    );
};

export default AppointmentModal;



