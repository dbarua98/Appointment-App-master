import React, { useState, useEffect, useCallback } from "react";
import { Col } from "react-bootstrap";
import {
  Validator,
  RequiredRule,
} from "devextreme-react/validator";
import { Button } from "devextreme-react/button";
import { Popup } from "devextreme-react/popup";
import TextBox from "devextreme-react/text-box";
import DateBox from "devextreme-react/date-box";
import { SelectBox } from "devextreme-react/select-box";
import { NumberBox } from 'devextreme-react/number-box';

const ReceiptModal = ({
  show,
  handleClose,
  handleSave,
  selectedReceipt,
  receiptData,
  handleDateChange,
  handleChange,
  setReceiptData,
  itemList,

}) => {
  const formattedItemOptions = itemList.map((item) => ({
    Name: item.ItemName,
    ID: item.ItemID,
  }));

  const dataDetail = selectedReceipt?.ReceiptDetail.map((item) => {
    return {
      receiptDetailID: item.ReceiptDetailID,
      receiptID: item.ReceiptID,
      itemID: item.ItemID,
      quantity: item.Quantity,
      rate: item.Rate,
      discount: item.Discount,
      discountPercent: item.Discount,
      amount: item.Amount,
      itemName: "",
      unit: "",
      grossAmount: 0,
    };
  });

  useEffect(() => {
    debugger;
    console.log("object", selectedReceipt);
    if (selectedReceipt) {
      setReceiptData({
        ...receiptData,
        receiptNo: selectedReceipt.ReceiptNo,
        personName: "",
        receiptDate: selectedReceipt.ReceiptDate,
        doctorID: selectedReceipt.DoctorID,
        netAmount: selectedReceipt.NetAmount,
        remarks: selectedReceipt.Remarks,
        receiptDetail: dataDetail,
      });
    }
    console.log("received", receiptData.receiptDetail);
  }, [selectedReceipt]);

  const handleAddRow = () => {
    setReceiptData((prevState) => ({
      ...prevState,
      receiptDetail: [
        ...prevState.receiptDetail,
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
          grossAmount: null,
          discountPercent: null,
        },
      ],
    }));
  };

  // Calculate gross amount
  const calculateGrossAmount = (item) => {
    return item.quantity * item.rate;
  };

  // Calculate discount amount
  const calculateDiscountAmount = (item) => {
    console.log("calculated value", item);
    return (item.quantity * item.rate * item.discountPercent) / 100;
  };

  // Calculate total amount
  const calculateAmount = (item) => {
    const grossAmount = calculateGrossAmount(item);
    const discountAmount = calculateDiscountAmount(item);
    const amnt = grossAmount - discountAmount;
    item["amount"] = amnt;
    return grossAmount - discountAmount;
  };
  const totalAmount = receiptData.receiptDetail.reduce(
    (total, detail) => total + detail.amount,
    0
  );
  useEffect(() => {
    setReceiptData({
      ...receiptData,
      netAmount: totalAmount,
    });
  }, [totalAmount]);

  const totalQuantity = receiptData.receiptDetail.reduce(
    (total, detail) => total + parseInt(detail.quantity),
    0
  );



  const handleItemChange = (name, index, e) => {
    console.log("nameChange", name);
    console.log("changedValue", e);
    console.log("Index", index);

    setReceiptData(prevState => {
      const updatedItems = [...prevState.receiptDetail];
      updatedItems[index]["itemID"] = name.value;
      return {
        ...prevState,
        receiptDetail: updatedItems
      };
    });
  };


  const now = new Date();

  // const [value, setValue] = useState(new Date(1981, 3, 27));

  // const onValueChanged = useCallback((e) => {
  //   setValue(e.value);
  // }, []);

  const handleValueChange = useCallback((name, index, e) => {
    console.log("nameCahnge", name)
    console.log("changedValue", index)
    console.log("Index", e)
    setReceiptData(prevState => {
      const updatedItems = [...prevState.receiptDetail];
      updatedItems[index][`${name}`] = e;
      return {
        ...prevState,
        receiptDetail: updatedItems
      };
    });
  }, []);
  console.log("this is Selevceted", receiptData)
  return (
    <Popup
      visible={show}
      onHiding={handleClose}
      dragEnabled={false}
      hideOnOutsideClick={true}
      showCloseButton={true}
      showTitle={true}
      title={selectedReceipt ? "Edit Receipt" : "Add Receipt"}
      container=".dx-viewport"
      maxWidth={850}
      maxHeight={550}
    >
      <form onSubmit={handleSave}>
        <div className="d-flex justify-content-between my-2">
          <TextBox
            name="receiptNo"
            label="Receipt No"
            labelMode="floating"
            value={receiptData.receiptNo}
            readOnly={true}
          ></TextBox>

          <DateBox
            type="date"
            value={(receiptData?.receiptDate) ? (receiptData?.receiptDate) : now}
            maxLength={50}
            label="Receipt Date"
            labelMode="floating"
            onValueChanged={handleDateChange}
            validationMessagePosition="down"
            pickerType={"calendar"}
            useMaskBehavior={true}
          />

        </div>
        <TextBox
          name="personName"
          label="Person Name"
          labelMode="floating"
          placeholder="Enter Person Name"
          value={receiptData.personName}
          onValueChange={(e) => handleChange("personName", e)}
          valueChangeEvent="input"
          showClearButton={true}
          maxLength={20}
          validationMessagePosition="down"
        >
        </TextBox>

        {receiptData.receiptDetail.map((item, index) => (
          <div key={index} className="d-md-flex gap-1 my-2">
            <Col >
              <SelectBox
                searchEnabled={true}
                dataSource={formattedItemOptions}
                displayExpr={"Name"}
                valueExpr={"ID"}
                value={(item.itemID)?(item.itemID):null}
                onValueChanged={(e) => handleItemChange(e, index, item)}
                showDropDownButton={true}
                label="ItemName"
                labelMode="floating"
                validationMessagePosition="down"
              >
                <Validator>
                  <RequiredRule message="Please Select the Item" />
                </Validator>
              </SelectBox>
            </Col>
            <Col>
              <NumberBox
                name='rate'
                mode="number"
                placeholder="Rate"
                min={0}
                step={0}
                value={item.rate}
                maxLength={10}
                valueChangeEvent='input'
                label='Rate'
                labelMode='floating'
                onValueChange={(e) => { handleValueChange("rate", index, e) }}
                validationMessagePosition='bottom'
              >
                <Validator>
                  <RequiredRule message="Please Enter Rate" />
                </Validator>
              </NumberBox>
            </Col>
            <Col>
              <NumberBox
                name='quantity'
                mode="number"
                placeholder="Quantity"
                min={0}
                step={0}
                value={item.quantity}
                maxLength={10}
                valueChangeEvent='input'
                label='Quantity'
                labelMode='floating'
                onValueChange={(e) => { handleValueChange("quantity", index, e) }}
                validationMessagePosition='bottom'
              >
                <Validator>
                  <RequiredRule message="Please Enter Quantity" />
                </Validator>
              </NumberBox>
            </Col>
            <Col>
              <Col>
                <TextBox
                  name="unit"
                  label="Gross Amount"
                  labelMode="floating"
                  placeholder="Gross Amount"
                  value={calculateGrossAmount(item)}
                  maxLength={20}
                  validationMessagePosition="down"
                  readOnly={true}
                ></TextBox>
              </Col>
            </Col>
            <Col>
              <NumberBox
                name='discountPercent'
                mode="number"
                placeholder="Discount Percent"
                min={0}
                step={0}
                value={item.discountPercent}
                maxLength={10}
                valueChangeEvent='input'
                label='Discount Percent'
                labelMode='floating'
                onValueChange={(e) => { handleValueChange("discountPercent", index, e) }}
                validationMessagePosition='bottom'
              >
                <Validator>
                  <RequiredRule message="Please Enter Discount Percent" />
                </Validator>
              </NumberBox>
            </Col>
            <Col>
              <TextBox
                name="discount"
                label="Discount Amount"
                labelMode="floating"
                placeholder="Discount Amount"
                value={calculateDiscountAmount(item)}
                maxLength={20}
                validationMessagePosition="down"
                readOnly={true}
              ></TextBox>
            </Col>
            <Col>
              <TextBox
                name="amount"
                label="Amount"
                labelMode="floating"
                placeholder="Amount"
                value={calculateAmount(item)}
                maxLength={20}
                validationMessagePosition="down"
                readOnly={true}
              ></TextBox>
            </Col>
          </div>
        ))}
        <Button variant="primary" onClick={handleAddRow}>
          Add Item
        </Button>
        <div className="d-flex flex-column gap-2 my-2">
          <TextBox
            name="totalQuantity"
            label="Total Quantity"
            labelMode="floating"
            placeholder="Total Quantity"
            value={totalQuantity ? (totalQuantity) : 0}
            maxLength={20}
            readOnly={true}
          ></TextBox>
          <TextBox
            name="netAmount"
            label="Net Amount"
            labelMode="floating"
            placeholder="Net Amount"
            value={receiptData.netAmount}
            readOnly={true}
            maxLength={20}
          ></TextBox>
          <TextBox
            name="remarks"
            label="Remarks"
            labelMode="floating"
            placeholder="Remarks"
            value={receiptData.remarks}
            valueChangeEvent="input"
            onValueChange={(e) => handleChange("remarks", e)}
            showClearButton={true}
            maxLength={40}
            validationMessagePosition="down"
          >
            <Validator>
              <RequiredRule message="Please Enter Remarks" />
            </Validator>
          </TextBox>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button
            text="Cancel"
            type="normal"
            stylingMode="outlined"
            onClick={handleClose}
          />
          <Button
            useSubmitBehavior={true}
            text={selectedReceipt?"Update":"Save"}
            type="default"
            stylingMode="contained"
          />
        </div>
      </form>
    </Popup>
  );
};

export default ReceiptModal;