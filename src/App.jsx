import { useState } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import Map from "./components/Map";
import PatientForm from "./components/PatientForm";

function App() {
  const [isProfessional, setIsProfessional] = useState(null);
  const [stepNumber, setStepNumber] = useState(0);
  // const [patientScore, setPatientScore] = useState(0);
  return (
    <>
      <div>
        {stepNumber}
        {stepNumber == 0 && (
          <div>
            <p>Êtes-vous un professionnel de santé ?</p>
            <button onClick={() => setIsProfessional(true)}>Oui</button>
            <button onClick={() => setIsProfessional(false)}>Non</button>
            <button
              onClick={() => setStepNumber((stepNumber) => stepNumber + 1)}
            >
              Question suivante
            </button>
          </div>
        )}
        <div>
          { stepNumber > 0 ? <Map isProfessional={isProfessional}/> : null}

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
