import React from 'react';
import questions from './questions';
// import ProctorService from '../../../../hooks/ProctorService'
import ExamPaused from './ExamPaused';

type Props = {
  violationStatus: {
    facesDetected: number;
    objectDetected: string[];
  };
  // violationDuration: number;
  // violationWarning: boolean;
};

const Exam = ({ violationStatus }: Props) => {

  // console.log(violationStatus);

  // if (violationWarning) {
  //   return <div>
  //     <p>WARNING WARNING WARNING!!!</p>
  //     <p>Your face is not clearly visible on the camera, please remove any obstacle and show your face clearly at the camera.</p>
  //     <p>Make sure there is no one around you. You may get disqualified if you don&apos;t follow the rules properly.</p>
  //     <p>You have {violationDuration} seconds before you are disqualified.</p>
  //   </div>;
  // }


  return (
    <>
      {/* <video ref={videoRef} autoPlay playsInline></video> */}
      {/* {violationStatus.facesDetected > 1 && <span style={{ color: "red" }}>{violationStatus.facesDetected} faces detected</span>} */}

      {violationStatus.facesDetected !== 1 || violationStatus.objectDetected.filter((object) => object !== "person").length > 0 ? <ExamPaused /> :
        <div
          className='py-4 px-2 bg-slate-800'
        >
          <h1 style={{ textAlign: 'center' }}>Exam in progress!</h1>

          {questions.map((q, i) => (
            <div key={q.id} className="question">
              <h4>Question {i + 1}</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{q.text}</p>
              {q.options.map((option, i) => (
                <div key={`option-${q.id}-${i}`}>
                  <input
                    style={{ marginInlineEnd: 8, marginBottom: 8 }}
                    type="radio"
                    id={option}
                    name={`question${q.id}`}
                    value={option}
                  />
                  <label htmlFor="html">{option}</label>
                  <br />
                </div>
              ))}
            </div>
          ))}
        </div>
      }
    </>
  );
};

export default Exam;
