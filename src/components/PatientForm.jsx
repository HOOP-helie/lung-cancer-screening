import questions from "@/data/patientQuestions.json";
import { use } from "react";
import { useState } from "react";

function PatientForm({ setStepNumber, stepNumber }) {
  const [patientAnswers, setPatientAnswers] = useState({});
  const [patientScore, setPatientScore]= useState(0);

  function calculateResults () {
    let score = 0
    questions.map((q) => {
      //  if (patientAnswers[q.id] === true){
      //   score = 
      //  }

        console.log("réponse patient". patientAnswers[q.id].answer)

    
    })
 
  }
  return (
    <div>
      {questions.map((q, i) => (
        <div key={q.id} className={stepNumber != i + 1 ? "hidden" : ""}>
          <p>{q.text}</p>
          <button
            onClick={() =>
              setPatientAnswers((prev) => ({ ...prev, [q.id]: true }))
            }
          >
            Oui
          </button>
          <button
            onClick={() =>
              setPatientAnswers((prev) => ({ ...prev, [q.id]: false }))
            }
          >
            Non
          </button>
        </div>
      ))}

      {stepNumber == questions.length ? (
        <button onClick={() => {
          setStepNumber(prev => prev + 1);
          calculateResults()
          
        } }>
          Voir mes résultats
        </button>
      ) : (
        <button onClick={() => setStepNumber((stepNumber) => stepNumber + 1)}>
          Question suivante
        </button>
      )}
    </div>
  );
}

export default PatientForm;
