import React from 'react'

// type Props = {}

const ExamPaused = () => {
  return (
    <div
      // style={{
      //   // backgroundColor: '#ffcccb',
      //   border: "1px solid gray",
      //   padding: "24px",
      //   display: 'flex',
      //   justifyContent: 'center',
      //   alignItems: 'center',
      //   flexDirection: 'column',
      // }}
      className='bg-neutral-900 border border-gray-900 p-6 flex justify-center items-center flex-col'
    >
      <h2 className='italic'>Exam Paused!</h2>
      <ul>
        <li>
          Exam has been un-mounted from the dom to prevent user from messing around using developer
          tools.
        </li>
        <li>
          You can keep a warning count of the user and terminate the test if the user exceeds a
          minimum threshold of warnings.
        </li>
      </ul>
    </div>
  )
}

export default ExamPaused;
