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
    <div>
      <div className="form-screening-header">
        <h2>Suis-je éligible au dépistage ?</h2>
        <p>Pour le savoir, c’est simple, répondez à ces quelques questions</p>
      </div>
      <div className="form-screening">
        <button
          onClick={() => setStepNumber((stepNumber) => stepNumber - 1)}
          // disabled={isDoctor === null}
          className="prev-btn"
        >
          {"<< Précédent"}
        </button>
        {questions.map((q, i) => (
          <div
            className={
              i + 1 == stepNumber ? "question-block visible" : "question-block hidden"
            }
            key={q.id}
          >
            <div className="question-container">
              <div className="question-content">
                <h3>{q.title}</h3>
                {q.subtitle && <p className="subtitle">{q.subtitle}</p>}
                <div className={`options-container ${q.css || ""}`}>
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
                  disabled={!(q.id in answers)}
                >
                  Voir mes résultats
                </button>
              ) : (
                <button
                  onClick={() => setStepNumber((stepNumber) => stepNumber + 1)}
                  className={`next-btn ${q.id in answers ? "" : "hidden"}`}
                >
                  {"Question suivante >>"}
                </button>
              )}
            </div>
            <p className="anonymous-form-info">
              Ce questionnaire est anonyme, nous ne conservons aucune de vos
              informations.
            </p>
          </div>
        ))}
        {score !== null &&
          stepNumber === questions.length + 1 &&
          (score < 2 ? (
            <div className="non-eligible-results">
              <p>
                Le dépistage organisé du cancer colorectal ne vous est pas
                encore recommandé.{" "}
              </p>
              <p>
                En cas de symptômes ou d’antécédents, n’hésitez pas à en parler
                avec un professionnel de santé.
              </p>
            </div>
          ) : (
            <>
              <div className="eligible-results">
                <p>Vous êtes éligible au dépistage !   Parlez-en à votre médecin traitant.</p>
                <p>
                 Consultez la carte
                  ci-dessus pour trouver un centre d’imagerie proche de chez
                  vous où faire votre scanner.
                </p>
              </div>
              <div>
                
              </div>
            </>
          ))}
      </div>
      {score >= 2 &&
          stepNumber === questions.length + 1 &&
         (<Map setStepNumber={setStepNumber} />)}
    </div>
  );
}

export default PatientForm;
