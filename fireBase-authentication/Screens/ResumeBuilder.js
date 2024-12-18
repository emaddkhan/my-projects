// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   TextInput,
//   ScrollView,
//   Platform,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import DateTimePicker from '@react-native-community/datetimepicker';

// export default function ResumeBuilder() {
//   const [sections, setSections] = useState({
//     personalInfo: true,
//     education: false,
//     workExperience: false,
//     projects: false,
//     skills: false,
//   });

//   const [fullName, setFullName] = useState('');
//   const [profession, setProfession] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [linkedin, setLinkedin] = useState('');

//   const [education, setEducation] = useState([
//     {
//       institution: '',
//       degree: '',
//       fieldOfStudy: '',
//       grade: '',
//       startDate: new Date(),
//       endDate: new Date(),
//     },
//   ]);

//   const [workExperience, setWorkExperience] = useState([
//     {
//       jobTitle: '',
//       companyName: '',
//       startDate: new Date(),
//       endDate: new Date(),
//     },
//   ]);

//   const [activeDateField, setActiveDateField] = useState(null);

//   const toggleSection = (section) => {
//     setSections((prevState) => ({
//       ...prevState,
//       [section]: !prevState[section],
//     }));
//   };

//   const handleDateChange = (event, selectedDate, index, field, section) => {
//     if (selectedDate) {
//       const updatedSection = section === 'education' ? [...education] : [...workExperience];
//       updatedSection[index][field] = selectedDate;
//       section === 'education' ? setEducation(updatedSection) : setWorkExperience(updatedSection);
//     }
//     setActiveDateField(null);
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.heading}>Build Your Resume</Text>

//       {/* Personal Information */}
//       <TouchableOpacity
//         style={styles.sectionHeader}
//         onPress={() => toggleSection('personalInfo')}
//       >
//         <Text style={styles.sectionHeaderText}>Personal Information</Text>
//         <Ionicons
//           name={sections.personalInfo ? 'chevron-up' : 'chevron-down'}
//           size={20}
//           color="#0782F9"
//         />
//       </TouchableOpacity>
//       {sections.personalInfo && (
//         <View style={styles.sectionContent}>
//           <TextInput
//             style={styles.input}
//             placeholder="Full Name"
//             value={fullName}
//             onChangeText={setFullName}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Profession"
//             value={profession}
//             onChangeText={setProfession}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Email Address"
//             value={email}
//             onChangeText={setEmail}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Phone Number"
//             value={phone}
//             onChangeText={setPhone}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="LinkedIn Profile"
//             value={linkedin}
//             onChangeText={setLinkedin}
//           />
//         </View>
//       )}

//       {/* Education */}
//       <TouchableOpacity
//         style={styles.sectionHeader}
//         onPress={() => toggleSection('education')}
//       >
//         <Text style={styles.sectionHeaderText}>Education</Text>
//         <Ionicons
//           name={sections.education ? 'chevron-up' : 'chevron-down'}
//           size={20}
//           color="#0782F9"
//         />
//       </TouchableOpacity>
//       {sections.education && (
//         <View style={styles.sectionContent}>
//           {education.map((edu, index) => (
//   <View key={index} style={styles.subSection}>
//     <TextInput
//       style={styles.input}
//       placeholder="Institution Name"
//       value={edu.institution}
//       onChangeText={(text) => {
//         const updatedEducation = [...education];
//         updatedEducation[index].institution = text;
//         setEducation(updatedEducation);
//       }}
//     />
//     <TextInput
//       style={styles.input}
//       placeholder="Degree"
//       value={edu.degree}
//       onChangeText={(text) => {
//         const updatedEducation = [...education];
//         updatedEducation[index].degree = text;
//         setEducation(updatedEducation);
//       }}
//     />
//     <TextInput
//       style={styles.input}
//       placeholder="Field of Study"
//       value={edu.fieldOfStudy}
//       onChangeText={(text) => {
//         const updatedEducation = [...education];
//         updatedEducation[index].fieldOfStudy = text;
//         setEducation(updatedEducation);
//       }}
//     />
//     <TextInput
//       style={styles.input}
//       placeholder="Grade"
//       value={edu.grade}
//       onChangeText={(text) => {
//         const updatedEducation = [...education];
//         updatedEducation[index].grade = text;
//         setEducation(updatedEducation);
//       }}
//     />
//     <TouchableOpacity
//       onPress={() =>
//         setActiveDateField({ index, field: 'startDate', section: 'education' })
//       }
//       style={styles.datePicker}
//     >
//       <Text style={styles.dateText}>
//         Start Date: {edu.startDate.toDateString()}
//       </Text>
//     </TouchableOpacity>
//     <TouchableOpacity
//       onPress={() =>
//         setActiveDateField({ index, field: 'endDate', section: 'education' })
//       }
//       style={styles.datePicker}
//     >
//       <Text style={styles.dateText}>
//         End Date: {edu.endDate.toDateString()}
//       </Text>
//     </TouchableOpacity>
//   </View>
// ))}

//           <TouchableOpacity
//             onPress={() =>
//               setEducation([
//                 ...education,
//                 {
//                   institution: '',
//                   degree: '',
//                   fieldOfStudy: '',
//                   grade: '',
//                   startDate: new Date(),
//                   endDate: new Date(),
//                 },
//               ])
//             }
//             style={styles.addButton}
//           >
//             <Text style={styles.addButtonText}>+ Add Education</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Work Experience */}
//       <TouchableOpacity
//         style={styles.sectionHeader}
//         onPress={() => toggleSection('workExperience')}
//       >
//         <Text style={styles.sectionHeaderText}>Work Experience</Text>
//         <Ionicons
//           name={sections.workExperience ? 'chevron-up' : 'chevron-down'}
//           size={20}
//           color="#0782F9"
//         />
//       </TouchableOpacity>
//       {sections.workExperience && (
//         <View style={styles.sectionContent}>
//           {workExperience.map((exp, index) => (
//             <View key={index} style={styles.subSection}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Job Title"
//                 value={exp.jobTitle}
//                 onChangeText={(text) => {
//                   const updatedWork = [...workExperience];
//                   updatedWork[index].jobTitle = text;
//                   setWorkExperience(updatedWork);
//                 }}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Company Name"
//                 value={exp.companyName}
//                 onChangeText={(text) => {
//                   const updatedWork = [...workExperience];
//                   updatedWork[index].companyName = text;
//                   setWorkExperience(updatedWork);
//                 }}
//               />
//               <TouchableOpacity
//                 onPress={() =>
//                   setActiveDateField({ index, field: 'startDate', section: 'workExperience' })
//                 }
//                 style={styles.datePicker}
//               >
//                 <Text style={styles.dateText}>
//                   Start Date: {exp.startDate.toDateString()}
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() =>
//                   setActiveDateField({ index, field: 'endDate', section: 'workExperience' })
//                 }
//                 style={styles.datePicker}
//               >
//                 <Text style={styles.dateText}>
//                   End Date: {exp.endDate.toDateString()}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           ))}
//           <TouchableOpacity
//             onPress={() =>
//               setWorkExperience([
//                 ...workExperience,
//                 {
//                   jobTitle: '',
//                   companyName: '',
//                   startDate: new Date(),
//                   endDate: new Date(),
//                 },
//               ])
//             }
//             style={styles.addButton}
//           >
//             <Text style={styles.addButtonText}>+ Add Work Experience</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* DateTimePicker */}
//       {activeDateField && (
//         <DateTimePicker
//           value={
//             activeDateField.section === 'education'
//               ? education[activeDateField.index][activeDateField.field]
//               : workExperience[activeDateField.index][activeDateField.field]
//           }
//           mode="date"
//           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//           onChange={(event, selectedDate) =>
//             handleDateChange(
//               event,
//               selectedDate,
//               activeDateField.index,
//               activeDateField.field,
//               activeDateField.section
//             )
//           }
//         />
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f9f9f9',
//   },
//   heading: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#0782F9',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   sectionHeaderText: {
//     fontSize: 18,
//     color: '#fff',
//     fontWeight: '600',
//   },
//   sectionContent: {
//     backgroundColor: '#fff',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//     backgroundColor: '#f9f9f9',
//   },
//   datePicker: {
//     padding: 12,
//     backgroundColor: '#f2f2f2',
//     borderRadius: 8,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   dateText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   addButton: {
//     padding: 12,
//     backgroundColor: '#0782F9',
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   addButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   subSection: {
//     marginBottom: 16,
//   },
// });
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

export default function ResumeBuilder() {
  const [sections, setSections] = useState({
    personalInfo: true,
    education: false,
    workExperience: false,
    projects: false,
    skills: false,
  });

  const [fullName, setFullName] = useState('');
  const [profession, setProfession] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [education, setEducation] = useState([
    {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      grade: '',
      startDate: new Date(),
      endDate: new Date(),
    },
  ]);
  const [workExperience, setWorkExperience] = useState([
    {
      jobTitle: '',
      companyName: '',
      startDate: new Date(),
      endDate: new Date(),
    },
  ]);
  const [activeDateField, setActiveDateField] = useState(null);

  const toggleSection = (section) => {
    setSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleDateChange = (event, selectedDate, index, field, section) => {
    if (selectedDate) {
      const updatedSection = section === 'education' ? [...education] : [...workExperience];
      updatedSection[index][field] = selectedDate;
      section === 'education' ? setEducation(updatedSection) : setWorkExperience(updatedSection);
    }
    setActiveDateField(null);
  };

  const generatePDF = async () => {
    const pdfPath = `${RNFS.DocumentDirectoryPath}/Resume.pdf`;

    const personalInfoPage = PDFPage.create()
      .setMediaBox(612, 792)
      .drawText(`Full Name: ${fullName}`, { x: 50, y: 750, fontSize: 16 })
      .drawText(`Profession: ${profession}`, { x: 50, y: 730, fontSize: 16 })
      .drawText(`Email: ${email}`, { x: 50, y: 710, fontSize: 16 })
      .drawText(`Phone: ${phone}`, { x: 50, y: 690, fontSize: 16 })
      .drawText(`LinkedIn: ${linkedin}`, { x: 50, y: 670, fontSize: 16 });

    const educationText = education.map(
      (edu, idx) =>
        `\nEducation ${idx + 1}:\n  Institution: ${edu.institution}\n  Degree: ${edu.degree}\n  Field of Study: ${edu.fieldOfStudy}\n  Grade: ${edu.grade}\n  Dates: ${edu.startDate.toDateString()} - ${edu.endDate.toDateString()}\n`
    );

    const educationPage = PDFPage.create()
      .setMediaBox(612, 792)
      .drawText('Education', { x: 50, y: 750, fontSize: 20 })
      .drawText(educationText.join(''), { x: 50, y: 730, fontSize: 14 });

    const workText = workExperience.map(
      (work, idx) =>
        `\nWork ${idx + 1}:\n  Job Title: ${work.jobTitle}\n  Company: ${work.companyName}\n  Dates: ${work.startDate.toDateString()} - ${work.endDate.toDateString()}\n`
    );

    const workPage = PDFPage.create()
      .setMediaBox(612, 792)
      .drawText('Work Experience', { x: 50, y: 750, fontSize: 20 })
      .drawText(workText.join(''), { x: 50, y: 730, fontSize: 14 });

    const pdfDoc = PDFDocument.create(pdfPath)
      .addPages(personalInfoPage, educationPage, workPage);
    await pdfDoc.write();

    return pdfPath;
  };

  const handlePreview = async () => {
    try {
      const pdfPath = await generatePDF();
      await FileViewer.open(pdfPath);
    } catch (error) {
      console.error('Error previewing file:', error);
    }
  };

  const handleDownload = async () => {
    try {
      const pdfPath = await generatePDF();
      alert('PDF downloaded to device successfully.');
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Build Your Resume</Text>
      {/* Your existing sections */}
      <TouchableOpacity style={styles.submitButton} onPress={handlePreview}>
        <Text style={styles.submitButtonText}>Preview PDF</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.submitButton} onPress={handleDownload}>
        <Text style={styles.submitButtonText}>Download PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  submitButton: {
    padding: 12,
    backgroundColor: '#0782F9',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
