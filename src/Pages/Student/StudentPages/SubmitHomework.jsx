import React, { useState } from "react";
import LeftSideNavbar from "../Components/LeftSideNavBar";
import SubmitHWmainBox from "../Components/submitHWComponent/SubmitHWmainBox";
import RightSideBarHW from "../Components/submitHWComponent/RightSideBarHW";
import PendingHomeWork from "../Components/submitHWComponent/PendingHomeWork";
import PendingList from "../Components/submitHWComponent/PendingList";

const SubmitHomework = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [submittedHomework, setSubmittedHomework] = useState([]); // Initialize as an empty array

  const handleToggleSidebar = () => {
    setIsExpanded((prevState) => !prevState);
  };
  
  return (
    <div className="flex flex-wrap">
      <LeftSideNavbar
        isExpanded={isExpanded}
        toggleSidebar={handleToggleSidebar}
      />
      <div
        className={`flex-1 transition-all duration-300 ml-${
          isExpanded ? "64" : "16"
        } p-6 mr-50 overflow-x-auto`}
      >
       
        {/* <div className="justify-between gap-6">
          <SubmitHWmainBox onFileupload={handleFileUpload} /> 
          
        </div>   */}
        <div className="gap-5 mr-50"> 
        <PendingList/>
        </div> 
      </div> 
      <RightSideBarHW
       submittedHomework={submittedHomework}  
      />  
      
      
    </div>
  );
};

export default SubmitHomework;
