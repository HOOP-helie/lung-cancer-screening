import { useState } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import Map from "./components/Map";
import PatientForm from "./components/PatientForm";

function App() {
  const [isDoctor, setIsDoctor] = useState(null);
  const [stepNumber, setStepNumber] = useState(0);
  // const [patientScore, setPatientScore] = useState(0);
  return (
    <>
      <div>
        {stepNumber == 0 && (
          <div>
            <p>Êtes-vous un professionnel de santé ?</p>
            <button onClick={() => setIsDoctor(true)}>Oui</button>
            <button onClick={() => setIsDoctor(false)}>Non</button>
            <button
              onClick={() => setStepNumber((stepNumber) => stepNumber + 1)}
            >
              Question suivante
            </button>
          </div>
        )}
        <div>
          { stepNumber > 0 ? <Map isDoctor={isDoctor}/> : null}

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
      </div>
    </>
  );
}

export default App;
