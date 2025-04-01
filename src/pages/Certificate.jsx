import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useLocation } from 'react-router-dom';
import '../assets/css/certificate.css';
import signature from '../assets/img/signature.jpg';
import seal from '../assets/img/seal.jpg';

export function Certificate() {
    const location = useLocation();
    const projectData = location.state || {};
    
    const [volunteerName, setVolunteerName] = useState('');
    const [projectTitle, setProjectTitle] = useState(projectData.projectTitle || "THẮP SÁNG ƯỚC MƠ");
    const [organizationName, setOrganizationName] = useState(projectData.organizationName || "Volunteer Organization");
    const [issuedDate, setIssuedDate] = useState(projectData.completionDate || new Date().toLocaleDateString());
    const [fontSize, setFontSize] = useState(32);
    const certificateRef = useRef();

    useEffect(() => {
        // Fetch current user's name from localStorage or session if available
     
            setVolunteerName(projectData.volunteerName);
            handleFontSizeAdjustment(projectData.volunteerName);
        
    }, []);

    // Adjust font-size if name is too long
    const handleFontSizeAdjustment = (name) => {
        if (name.length > 15) setFontSize(28);
        if (name.length > 25) setFontSize(24);
        if (name.length > 35) setFontSize(20);
        if (name.length > 45) setFontSize(18);
    };

    // Handle name change
 

    // Export PDF
    const exportPDF = () => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
        });

        html2canvas(certificateRef.current, { 
            scale: 3,
            useCORS: true,
            scrollY: 0,
            windowWidth: 900,
            windowHeight: 800,
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', 0, 0, 297, 210);
            doc.save(`${volunteerName || 'Volunteer'}_${projectTitle}_Certificate.pdf`);
        });
    };

    // Export PNG
    const exportPNG = () => {
        html2canvas(certificateRef.current, { 
            scale: 3,
            useCORS: true,
            scrollY: 0,
            windowWidth: 900,
            windowHeight: 800,
        }).then((canvas) => {
            const link = document.createElement('a');
            link.download = `${volunteerName || 'Volunteer'}_${projectTitle}_Certificate.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    };

    return (
        <div className="certificate-container">
            {/* Input fields for certificate customization */}
        
            
            {/* Certificate preview area */}
            <div className="certificate" ref={certificateRef}>
                <h1>Certificate of Completion</h1>
                <p>This certifies that</p>
                <p className="volunteer-name" style={{ fontSize: `${fontSize}px` }}>
                    {volunteerName || "[Your Name Here]"}
                </p>
                <p>has successfully completed the project</p>
                <h2>"{projectTitle}"</h2>
                <p>Issued on: {issuedDate}</p>
                <p className="organization">Organization: {organizationName}</p>
                <div className="signature-section">
                    <img src={signature} alt="Signature" className="signature-img" />
                    <p>Authorized Signature</p>
                </div>
                <img src={seal} alt="Seal" className="seal-img" />
            </div>

            {/* Export buttons */}
            <div className="export-buttons">
                <button onClick={exportPDF} className="export-btn">
                    <i className="fas fa-file-pdf me-2"></i>Export as PDF
                </button>
                <button onClick={exportPNG} className="export-btn">
                    <i className="fas fa-file-image me-2"></i>Export as PNG
                </button>
            </div>
        </div>
    );
}

export default Certificate;