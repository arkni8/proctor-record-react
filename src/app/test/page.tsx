"use client";
import Alerts from './components/Alerts';
import { useProctoring } from '../../hooks/useProctoring';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ExamIntro from './components/Exam/ExamIntro';
import ExamPaused from './components/Exam/ExamPaused';
import Exam from './components/Exam';
// import DraggableContainer from '@/components/generic/DraggableContainer';
import DraggableContainer3d from '@/components/generic/DraggableContainer3d';
import UserMediaService from '@/hooks/UserMediaService';

// plan a timeout everytime the face is not clearly visible on camera;

function Test() {
    const [examHasStarted, setExamHasStarted] = useState(false);
    const userMediaRef = useRef<typeof UserMediaService>(UserMediaService);
    const userMedia = useMemo(() => userMediaRef.current(), []);

    // const [recordOverlap, setRecordOverlap] = useState(false);
    const recordOverlap = useRef(false);

    const mediaRef = useRef<MediaRecorder | undefined>();
    const recordTrack = useRef<Blob[]>([]);
    const mediaRef2 = useRef<MediaRecorder | undefined>();
    const recordTrack2 = useRef<Blob[]>([]);

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
            userMedia.init().then(() => {
                camDetection.requestAVPermission().then(() => {
                    requestAnimationFrame(() => camDetection.testWebcam());
                });
            });
        }
        // if (examHasStarted) {
        //     setTimeout(() => {

        //     }, 1000);
        // }
        return () => {
            if (userMedia.stream) {
                userMedia.stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    async function triggerCamera() {
        recordTrack.current = [];

        mediaRef.current = new MediaRecorder(userMedia.stream!.clone(), {
            mimeType: 'video/webm;codecs=vp8,opus'
        });
        // console.log(mediaRef.current);

        mediaRef.current.ondataavailable = (e) => {
            console.log("1 -");
            if (e.data.size > 0) {
                // setRecordedChunks((prev) => {
                //     prev.push(e.data);
                //     return prev;
                // });
                recordTrack.current.push(e.data);
                // console.log(recordOverlap);
            }
        };

        mediaRef.current.start(1000);
    }

    const handleStopRecording = useCallback(() => {
        if (mediaRef.current) {
            mediaRef.current.stop();
            console.log(recordTrack.current);
            requestAnimationFrame(() => {
                const blob = new Blob(recordTrack.current, { type: "video/webm" });
                const videoURL = URL.createObjectURL(blob);
                // videoRef2.current!.src = videoURL;
                const link = document.createElement('a');
                link.href = videoURL;
                link.download = 'stream-video.webm';
                link.click();
                recordTrack.current = [];
                mediaRef.current = undefined;
            });
            // setRecording(false);
        }

        // debug
        // if (userMedia.stream) {
        //     userMedia.stream.getTracks().forEach(track => track.stop());
        // }
    }, []);

    const triggerCamera2 = useCallback(async () => {
        recordTrack2.current = [];

        recordOverlap.current = true;
        mediaRef2.current = new MediaRecorder(userMedia.stream!.clone(), {
            mimeType: 'video/webm;codecs=vp8,opus'
        });
        // console.log(mediaRef.current);

        mediaRef2.current.ondataavailable = (e) => {
            console.log("2 - ");
            if (e.data.size > 0) {
                recordTrack2.current.push(e.data);
            }
        };

        mediaRef2.current.start(1000);
    }, []);

    const handleStopRecording2 = useCallback(() => {
        recordOverlap.current = false;
        mediaRef2.current?.stop();
        console.log(recordTrack2.current);
        requestAnimationFrame(() => {
            const blob = new Blob(recordTrack2.current, { type: "video/webm" });
            const videoURL = URL.createObjectURL(blob);
            // videoRef2.current!.src = videoURL;
            const link = document.createElement('a');
            link.href = videoURL;
            link.download = 'stream2-video.webm';
            link.click();
            recordTrack2.current = [];
            mediaRef2.current = undefined;
        });
    }, []);

    if (!examHasStarted) {
        return (
            <>
                <div className='text-center'>
                    <button className='mr-3' onClick={() => triggerCamera()}>Here&apos;s a record 1 button</button>
                    <button onClick={() => handleStopRecording()}>Here&apos;s a stop button</button>
                    <br />
                    <button className='mr-3' onClick={() => triggerCamera2()}>Here&apos;s a record 2 button</button>
                    <button onClick={() => handleStopRecording2()}>Here&apos;s a stop button</button>
                </div>
                {/* <video ref={videoRef2} controls /> */}
                <ExamIntro
                    onClick={() => {
                        fullScreen.trigger();
                        setExamHasStarted(true);

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