import { useState } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import Map from "./components/Map";
import PatientForm from "./components/PatientForm";
import doctorImg from "@/assets/img/doctor.png";
import womanImg from "@/assets/img/woman.png";
import clueImg from "@/assets/img/clue.png";

function App() {
  const [isDoctor, setIsDoctor] = useState(null);
  const [stepNumber, setStepNumber] = useState(0);
  // const [patientScore, setPatientScore] = useState(0);
  return (
    <>
      <main className="main-container">
        {stepNumber == 0 && (
          <div className="visitor-status-form">
            <div className="avatar-container">
              {isDoctor === null && <img src={clueImg} alt="Recherche" />}
              {isDoctor === true && <img src={doctorImg} alt="Docteur" />}
              {isDoctor === false && <img src={womanImg} alt="Patient" />}
            </div>

            <p>Êtes-vous un professionnel de santé ?</p>
            <div className="visitor-status-form--answers">
              <button
                className={isDoctor ? "selected" : null}
                onClick={() => setIsDoctor(true)}
              >
                Oui
              </button>
              <button
                className={isDoctor === false ? "selected" : null}
                onClick={() => setIsDoctor(false)}
              >
                Non
              </button>
            </div>
            <button
              onClick={() => setStepNumber((stepNumber) => stepNumber + 1)}
              disabled={isDoctor === null}
            >
              Voir l'annuaire
            </button>
          </div>
        )}
        <div>
          {stepNumber > 0 ? <Map isDoctor={isDoctor} /> : null}
          {/* {isProfessional && stepNumber > 0 ? <Map /> : null} */}
          {/* {!isProfessional && stepNumber > 0 ? (
            <PatientForm
              setPatientScore={setPatientScore}
              setStepNumber={setStepNumber}
              patientScore={patientScore}
              stepNumber={stepNumber}
            />
          ) : null} */}
        </div>
      </main>
    </>
  );
}

export default App;
{
  /* <a href="https://www.flaticon.com/free-icons/girl" title="girl icons">Girl icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/professions-and-jobs" title="professions and jobs icons">Professions and jobs icons created by Freepik - Flaticon</a> */
}
{/* <a href="https://www.flaticon.com/free-icons/unknown" title="unknown icons">Unknown icons created by Freepik - Flaticon</a> */}