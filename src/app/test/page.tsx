"use client";
import Alerts from './components/Alerts';
import { useProctoring } from '../../hooks/useProctoring';
import { useEffect, useState } from 'react';
import ExamIntro from './components/Exam/ExamIntro';
import ExamPaused from './components/Exam/ExamPaused';
import Exam from './components/Exam';
import DraggableContainer from '@/components/generic/DraggableContainer';
import DraggableContainer3d from '@/components/generic/DraggableContainer3d';

function Test() {
    const [examHasStarted, setExamHasStarted] = useState(false);

    const { fullScreen, tabFocus, camDetection } = useProctoring({
        forceFullScreen: true,
        preventTabSwitch: true,
        preventContextMenu: true,
        preventUserSelection: true,
        preventCopy: true,
        monitorCam: true,
        hasExamStarted: examHasStarted,
    });

    useEffect(() => {
        if (camDetection.videoRef) {
            camDetection.requestAVPermission().then(() => {
                requestAnimationFrame(() => camDetection.startWebcam());
            });
        }
        // if (examHasStarted) {
        //     setTimeout(() => {

        //     }, 1000);
        // }
    }, []);

    if (!examHasStarted) {
        return (
            <>
                <ExamIntro
                    onClick={() => {
                        fullScreen.trigger();
                        setExamHasStarted(true);

                        // Wait before react finishes updating state. flushSync doesn't seem to work
                        setTimeout(() => {
                            // setExamHasStarted(true);
                            camDetection.startWebcam();
                        }, 500);
                    }}
                />
                <DraggableContainer3d>
                    <video className='live-player' ref={camDetection.videoRef} autoPlay playsInline />
                    {/* <div className='absolute inset-0 bg-red-500' /> */}
                </DraggableContainer3d>
            </>
        );
    }

    const getContent = () => {
        // console.log(fullScreen, tabFocus);
        // debugger;
        if (fullScreen.status === 'off') return <ExamPaused />;
        if (tabFocus.status === false) return <ExamPaused />;

        return <Exam violationStatus={camDetection.violationStatus} />;
    };

    return (
        <>
            {/* For debugging purpose */}
            {/* <pre>{JSON.stringify({ fullScreen, tabFocus }, null, 2)}</pre> */}

            <div className='bg-slate-800 text-center p-4'>
                {/* <h3>Here&apos;s the video feed</h3>
                <video className='live-player mx-auto mt-3' ref={camDetection.videoRef} autoPlay playsInline></video> */}

                <p className='mt-3'>Faces - {camDetection.faces}</p>
                <p className=''>Objects - {camDetection.objects}</p>
            </div>
            <div className="test-container">{getContent()}</div>

            <Alerts fullScreen={fullScreen} tabFocus={tabFocus} />

            <DraggableContainer3d>
                <video className='live-player' ref={camDetection.videoRef} autoPlay playsInline></video>
            </DraggableContainer3d>
        </>
    );
}

export default Test;