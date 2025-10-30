import questions from "@/data/patientQuestions.json";
import Map from "./Map";
import { useState } from "react";

function PatientForm({ setStepNumber, stepNumber }) {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  function handleChange(id, value) {
    if (stepNumber != questions.length) {
      setStepNumber((prevStep) => prevStep + 1);
    }
    setAnswers((prevAnswers) => ({ ...prevAnswers, [id]: parseInt(value) }));
  }

  function calculateResults() {
    let totalScore = 0;

    for (const [key, value] of Object.entries(answers)) {
      totalScore = totalScore + value;
    }
    setScore(totalScore);
  }
  return (
    <div className="form-screening">
      <button
        onClick={() => setStepNumber((stepNumber) => stepNumber - 1)}
        // disabled={isDoctor === null}
      >
        Précédent
      </button>
      {questions.map((q, i) => (
        <div
          className={
            i + 1 == stepNumber ? "question-block" : "question-block hidden"
          }
          key={q.id}
        >
          <div >
            <h3>{q.title}</h3>
            {q.subtitle && <p className="subtitle">{q.subtitle}</p>}
            <div className="options-container">
            {q.options.map((opt) => (
              <label key={opt.label}>
                <input
                  type="radio"
                  name={q.id}
                  value={opt.value}
                  onChange={() => handleChange(q.id, opt.value)}
                />
                {opt.label}
              </label>
            ))}
            </div>

          </div>
          {stepNumber == questions.length ? (
            <button
              onClick={() => {
                setStepNumber((stepNumber) => stepNumber + 1);
                calculateResults();
              }}
              disabled={!(q.id in answers) }
            >
              Voir mes résultats
            </button>
          ) : (
            <button
              onClick={() => setStepNumber((stepNumber) => stepNumber + 1)}
              className={q.id in answers ? "" : "hidden"}
            >
              Question suivante
            </button>
          )}
        </div>
      ))}
      {score !== null &&
        stepNumber === questions.length + 1 &&
        (score < 2 ? (
          <p>
            Le dépistage organisé du cancer colorectal ne vous est pas encore
            recommandé.
            <br />
            En cas de symptômes ou d’antécédents, n’hésitez pas à en parler avec
            un professionnel de santé.
          </p>
        ) : (
          <div>
            <p>
              Vous êtes éligible au dépistage, consultez votre médecin traitant.
              <br />
              Et voici les centres d’imagerie ou vous pourrez réalisez votre
              scanner.
            </p>
            <Map setStepNumber={setStepNumber} />
          </div>
        ))}
    </div>
  );
}

export default PatientForm;
