import { Snowfall } from "react-snowfall";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFlagData } from "./storeData";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.min.css';
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import Dialog from './Dialog';

const HomePage = () => {
    const [currentImg, setCurrentImg] = useState<string>("w2");
    const [showDialog, setShowDialog] = useState<boolean>(true); // Show dialog initially
    const [_,
setFullscreenRequested] = useState<boolean>(false); // Track fullscreen request status
    const backGround = ["w1", "w2", "w3"];
    const navigate = useNavigate();

    const handleImageChange = (direction: "next" | "prev") => {
        const currentIndex = backGround.indexOf(currentImg);
        const nextIndex = direction === "next" ? (currentIndex + 1) % backGround.length : (currentIndex - 1 + backGround.length) % backGround.length;
        setCurrentImg(backGround[nextIndex]);
    };

    const changePath = async () => {
        const flag = await getFlagData();

        if (flag) {
            localStorage.setItem('timeFlag', 'true');
            navigate('/crossword');
        } else {
            toast.info("Kindly wait for some more minutes to get started");
        }
    };

    const enterFullScreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                console.error("Error attempting to enable full-screen mode:", err);
            });
        } else if (elem.webkitRequestFullscreen) { // Safari
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE11
            elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        }
        
    };

    const handleConfirmFullscreen = () => {
        enterFullScreen();
        setFullscreenRequested(true);
        setShowDialog(false);
        localStorage.setItem('fullscreenRequested', 'true');
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        localStorage.setItem('fullscreenRequested', 'false');
    };

    useEffect(() => {
        const fullscreenRequested = localStorage.getItem('fullscreenRequested') === 'true';
        if (!fullscreenRequested) {
            setShowDialog(true);
        }
    }, []);

    return (
        <div className="font-shadow h-screen w-full overflow-hidden flex relative">
            <Snowfall />

            <img
                src={`/${currentImg}.jpg`}
                className="w-full h-full animate-[ping_1s]"
                alt="Background"
            />
            {backGround.indexOf(currentImg) === 0 && (
                <div className="absolute text-xl font-bold inset-0 flex items-center justify-center">
                    <div className="bg-gray-100 font-playfair p-6 rounded-lg shadow-lg max-w-2xl w-full text-center">
                        <p className="text-2xl mb-4">
                            This word search game was created by Munees and organized by the
                            III BCA B students.
                        </p>
                        <p className="text-xl font-semibold mb-4">
                            We would like to extend our special thanks to our <b>seniors</b> and
                            the <b>faculty members</b> for their invaluable support and guidance.
                        </p>
                        <p className="text-xl font-semibold mb-4">
                            A heartfelt thank you to our <b>Head of Department</b> for approving
                            and encouraging this event.
                        </p>
                        <p className="text-xl font-semibold mb-4">
                            We appreciate your <b>participation</b> and enthusiasm. We hope to see
                            you in future events!
                        </p>
                        <p className="text-xl font-semibold">
                            Best regards,
                            <br />
                            R. Karthik Balan <br />
                            P. Muneeswaran <br />
                            III BCA B Students
                        </p>
                    </div>
                </div>
            )}
            {backGround.indexOf(currentImg) === 2 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <video src="/demo1.mp4" autoPlay={true} controls className="w-[50rem] border-4 border-pink-700 shadow-md shadow-pink-600 rounded-md">
                        <source src="/demo1.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}
            <div className="absolute inset-y-1/2 left-0 right-0 flex justify-between px-4 z-10">
                <button
                    className="bg-gray-800 flex items-center animate-scale text-white p-4 rounded-full"
                    title="Previous Image"
                    onClick={() => handleImageChange("prev")}
                >
                    <BiSolidLeftArrow />
                </button>
                <button
                    className="bg-gray-800 flex items-center animate-scale text-white p-4 rounded-full"
                    title="Next Image"
                    onClick={() => handleImageChange("next")}
                >
                    <BiSolidRightArrow />
                </button>
            </div>
            <button
                className="absolute bottom-0 right-2 motion-safe:animate-[bounce_1.2s_infinite] z-10"
                title="Click to Start"
                onClick={changePath}
            >
                <img src="/btn.png" className="w-36 h-36" alt="Start Button" />
            </button>
            <ToastContainer />
            {showDialog && (
                <Dialog
                    onClose={handleCloseDialog}
                    onConfirm={handleConfirmFullscreen}
                />
            )}
        </div>
    );
};

export default HomePage;
