'use client';
import Image from "next/image";
import HomeCard from "./HomeCard";
import { useState } from "react";
import MediaModel from "./MediaModel";


const SocialMediaList = () => {
  const [modalInfo, setModalInfo] = useState<{
    isOpen: boolean;
    title: string;
    buttonText: string;
    image?: string;
    buttonIcon?: string;
  } | null>(null); 

  const openModal = (title: string, buttonText: string, image?: string, buttonIcon?: string) => {
    setModalInfo({ isOpen: true, title, buttonText, image, buttonIcon });
  };

  const closeModal = () => {
    setModalInfo(null);
  };

  const joinDiscord = () => {
    
  };

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 text-white py-5  mx-3 my-3">
      <HomeCard
        img="/discord.png"
        title="Discord"
        description={`<p>Step 1: Click on the Discord icon below.</p>
                      <p>Step 2: You will be redirected to the Discord Auth login page.</p>
                      <p>Step 3: Log in with your credentials and authorize the app.</p>
                      <p>Step 4: You will be redirected back to our platform once authenticated.</p>`}
        handleClick={() => openModal("Discord", "Join Discord", "/discord.png", "/discord.png")}
        className=" bg-blue-700"
      />
  
      <HomeCard 
        img="/slack.png"
        title="Slack"
        description={`<p>Step 1: Click on the Slack icon below.</p>
                      <p>Step 2: You will be redirected to the Slack Auth login page.</p>
                      <p>Step 3: Log in with your credentials and authorize the app.</p>
                      <p>Step 4: You will be redirected back to our platform once authenticated.</p>`}
        handleClick={() => openModal("Slack", "Join Slack", "/slack.png", "/slack.png")}
        className=" bg-yellow-300"
      />

      <HomeCard 
        img="/telegram.png"
        title="Telegram"
        description={`<p>Step 1: Click on the Telegram icon below.</p>
                      <p>Step 2: You will be redirected to the Telegram Auth login page.</p>
                      <p>Step 3: Log in with your credentials and authorize the app.</p>
                      <p>Step 4: You will be redirected back to our platform once authenticated.</p>`}
        handleClick={() => openModal("Telegram", "Join Telegram", "/telegram.png", "/telegram.png")}
        className=" bg-blue-400"
      />

      <HomeCard 
        img="/jsplogo.png"
        title="JSP"
        description={`<p>Step 1: Click on the JSP icon below.</p>
                      <p>Step 2: You will be redirected to the JSP Auth login page.</p>
                      <p>Step 3: Log in with your credentials and authorize the app.</p>
                      <p>Step 4: You will be redirected back to our platform once authenticated.</p>`}
        handleClick={() => openModal("JSP", "Join JSP", "/jsplogo.png", "/jsplogo.png")}
        className=" bg-black"
      />

      {modalInfo && (
        <MediaModel 
          isOpen={modalInfo.isOpen}
          onClose={closeModal}
          title={modalInfo.title}
          className="text-center"
          buttonText={modalInfo.buttonText}
          handleClick={joinDiscord} 
          image={modalInfo.image}
          buttonIcon={modalInfo.buttonIcon}
        />
      )}
    </section>
  );
};

export default SocialMediaList;

