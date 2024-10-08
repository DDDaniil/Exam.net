﻿import '../custom.css'
import React, {useEffect, useState} from 'react';
import {Employment} from "../enums/Employment";
import {Purpose} from "../enums/Purpose";
import {Deposit} from "../enums/Deposit";
import axios from "axios";
import {
    AdultMax,
    AdultMin, AmountMax, AmountMin,
    NameMaxLength,
    NameMinLength,
    PassportIssuerMaxLength,
    PassportIssuerMinLength,
    PassportNumberLength,
    PassportRegInformationMaxLength,
    PassportRegInformationMinLength,
    PassportSeriesLength,
    PatronymicMaxLength,
    PatronymicMinLength,
    SurnameMaxLength,
    SurnameMinLength
} from "../variables/Variables";
import {ICreditDataObject} from "../dataobject/ICreditDataObject";
import {IsCreditDataValid} from "../validators/CreditValidator";

export function CreditForm() {
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [patronymic, setPatronymic] = useState("")
    const [passportSeries, setPassportSeries] = useState<string>("")
    const [passportNumber, setPassportNumber] = useState<string>("")
    const [passportIssuer, setPassportIssuer] = useState("")
    const [passportIssueDate, setPassportIssueDate] = useState<Date>(new Date())
    const [passportRegInformation, setPassportRegInformation] = useState("")
    const [adult, setAdult] = useState<number>(0)
    const [isJudged, setJudging] = useState<boolean>(false)
    const [employment, setEmployment] = useState<Employment>(Employment.ContractLaborCodeRusFed)
    const [purpose, setPurpose] = useState<Purpose>(Purpose.Consumer)
    const [deposit, setDeposit] = useState<Deposit>(Deposit.None)
    const [carAge, setCarAge] = useState<number>(0)
    const [hasOtherCredits, setOtherCredits] = useState<boolean>(false)
    const [amount, setAmount] = useState<number>(0)

    const submitForm = async (e: any) => {
        e.preventDefault()
        let errorLabel = document.getElementsByClassName("errorLabel")[0];
        errorLabel.innerHTML = "&nbsp;";
        let dataobject: ICreditDataObject = {
            name: name,
            surname: surname,
            patronymic: patronymic,
            passportSeries: passportSeries,
            passportNumber: passportNumber,
            passportIssuer: passportIssuer,
            passportIssueDate: passportIssueDate,
            passportRegInformation: passportRegInformation,
            adult: adult,
            isJudged: isJudged,
            employment: employment,
            purpose: purpose,
            deposit: deposit,
            carAge: carAge,
            hasOtherCredits: hasOtherCredits,
            amount: amount
        };
        let result = IsCreditDataValid(dataobject)
        if (result === true) {
            axios.post("credit/take", dataobject)
                .then(r => errorLabel.innerHTML = r.data)
                .catch(r => console.log(r));
        } else
            errorLabel.innerHTML = result;
    }

    return (
        <div>
            <form>
                <div className="d-flex align-items-center flex-column container backgroundColor">
                    <label className="fw-bold">Имя</label>
                    <input className="w-25 mb-4 ground"
                           value={name}
                           minLength={NameMinLength}
                           maxLength={NameMaxLength}
                           onChange={(e) => setName(e.target.value)}/>
                    
                    <label className="fw-bold">Фамилия</label>
                    <input className="w-25 mb-4 ground"
                           value={surname}
                           minLength={SurnameMinLength}
                           maxLength={SurnameMaxLength}
                           onChange={(e) => setSurname(e.target.value)}/>
                    
                    <label className="fw-bold">Отчество</label>
                    <input className="w-25 mb-4 ground"
                           value={patronymic}
                           minLength={PatronymicMinLength}
                           maxLength={PatronymicMaxLength}
                           onChange={(e) => setPatronymic(e.target.value)}/>

                    <label className="fw-bold">Серия паспорта</label>
                    <input className="w-25 mb-4 ground"
                           value={passportSeries}
                           maxLength={PassportSeriesLength}
                           onChange={(e) => {
                               let value = Number.parseInt(e.target.value);
                               if (!isNaN(value) || e.target.value === "")
                                   setPassportSeries(e.target.value)
                           }}/>

                    <label className="fw-bold">Номер паспорта</label>
                    <input className="w-25 mb-4 ground"
                           value={passportNumber}
                           maxLength={PassportNumberLength}
                           onChange={(e) => {
                               let result = Number.parseInt(e.target.value);
                               if (!isNaN(result) || e.target.value === "")
                                   setPassportNumber(e.target.value)
                           }}/>

                    <label className="fw-bold">Кем выдан</label>
                    <input className="w-25 mb-4 ground"
                           value={passportIssuer}
                           minLength={PassportIssuerMinLength}
                           maxLength={PassportIssuerMaxLength}
                           onChange={(e) => setPassportIssuer(e.target.value)}/>

                    <label className="fw-bold">Дата выдачи</label>
                    <input className="w-25 mb-4 ground"
                           type="date"
                           value={passportIssueDate.toISOString().split('T')[0]}
                           min="1900-01-01"
                           max="2200-01-01"
                           onChange={(e) => {
                               if (!isNaN(Date.parse(e.target.value)))
                                   setPassportIssueDate(new Date(e.target.value));
                           }}/>

                    <label className="fw-bold">Информация о прописке</label>
                    <input className="w-25 mb-4 ground"
                           minLength={PassportRegInformationMinLength}
                           maxLength={PassportRegInformationMaxLength}
                           value={passportRegInformation}
                           onChange={(e) => setPassportRegInformation(e.target.value)}/>

                    <label className="fw-bold">Возраст</label>
                    <input className="w-25 mb-4 ground"
                           value={adult}
                           maxLength={3}
                           onChange={(e) => {
                               let result = Number.parseInt(e.target.value);
                               if (!isNaN(result))
                                   setAdult(result)
                               if (e.target.value === "")
                                   setAdult(0)
                           }}/>

                    <label className="fw-bold">Наличие судимости</label>
                    <select className="w-25 mb-4 ground"
                            onChange={(e) => {
                                if (e.target.value == "true")
                                    setJudging(true);
                                else
                                    setJudging(false);
                            }}>
                        <option value="false">Нет судимости</option>
                        <option value="true">Есть судимость</option>
                    </select>

                    <label className="fw-bold">Трудоустройство</label>
                    <select className="w-25 mb-4 ground"
                            onChange={(e) => {
                                let value = Number.parseInt(e.target.value);
                                switch (value) {
                                    case 0:
                                        setEmployment(Employment.ContractLaborCodeRusFed);
                                        break;
                                    case 1:
                                        setEmployment(Employment.IndividualEntrepreneur);
                                        break;
                                    case 2:
                                        setEmployment(Employment.Freelancer);
                                        break;
                                    case 3:
                                        setEmployment(Employment.Retiree);
                                        break;
                                    case 4:
                                        setEmployment(Employment.Unemployed);
                                        break;
                                }
                            }}>
                        <option value="0">Трудоустроен по трудовому договору</option>
                        <option value="1">Собственное ИП</option>
                        <option value="2">Фрилансер</option>
                        <option value="3">Пенсионер</option>
                        <option value="4">Безработный</option>
                    </select>


                    <label className="fw-bold">Цель кредита</label>
                    <select className="w-25 mb-4 ground"
                            onChange={(e) => {
                                let value = Number.parseInt(e.target.value);
                                switch (value) {
                                    case 0:
                                        setPurpose(Purpose.Consumer);
                                        break;
                                    case 1:
                                        setPurpose(Purpose.Realty);
                                        break;
                                    case 2:
                                        setPurpose(Purpose.Recrediting);
                                        break;
                                }
                            }}>
                        <option value="0">Потребительский кредит</option>
                        <option value="1">Недвижимость</option>
                        <option value="2">Перекредитование</option>
                    </select>

                    <label className="fw-bold">Залог</label>
                    <select className="w-25 mb-4 ground"
                            onChange={(e) => {
                                let value = Number.parseInt(e.target.value);
                                switch (value) {
                                    case 0:
                                        setDeposit(Deposit.None);
                                        break;
                                    case 1:
                                        setDeposit(Deposit.Retiree);
                                        break;
                                    case 2:
                                        setDeposit(Deposit.Car);
                                        break;
                                    case 3:
                                        setDeposit(Deposit.Guarantee);
                                        break;
                                }
                            }}>
                        <option value="0">Без залога</option>
                        <option value="1">Недвижимость</option>
                        <option value="2">Автомобиль</option>
                        <option value="3">Поручительство</option>
                    </select>

                    <label className="fw-bold">Возраст авто(учитывается, если в пункте "залог" выбран автомобиль)</label>
                    <input className="w-25 mb-4 ground"
                           value={carAge}
                           maxLength={2}
                           onChange={(e) => {
                               let result = Number.parseInt(e.target.value);
                               if (!isNaN(result))
                                   setCarAge(result)
                               if (e.target.value == "")
                                   setCarAge(0)
                           }}/>

                    <label className="fw-bold">Наличие других кредитов</label>
                    <select className="w-25 mb-4 ground"
                            onChange={(e) => {
                                if (e.target.value == "true")
                                    setOtherCredits(true);
                                else
                                    setOtherCredits(false);
                            }}>
                        <option value="false">Нет</option>
                        <option value="true">Есть</option>
                    </select>

                    <label className="fw-bold">Сумма</label>
                    <input className="w-25 mb-4 ground"
                           value={amount}
                           maxLength={AmountMax.toString().length}
                           onChange={(e) => {
                               let result = Number.parseInt(e.target.value);
                               if (!isNaN(result))
                                   setAmount(result)
                               if (e.target.value == "")
                                   setAmount(0)
                           }}/>

                    <button className="mb-4 colorButton ground fw-bold" onClick={submitForm}>Отправить</button>
                    <label className="errorLabel fw-bold">&nbsp;</label>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                </div>
            </form>
        </div>
    )
}