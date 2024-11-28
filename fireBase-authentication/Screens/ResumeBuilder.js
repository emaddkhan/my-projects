// // // import React, { useState } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   TouchableOpacity,
// // //   StyleSheet,
// // //   TextInput,
// // //   ScrollView,
// // //   Platform,
// // //   Animated,
// // // } from 'react-native';
// // // import { Ionicons } from '@expo/vector-icons';
// // // import DateTimePicker from '@react-native-community/datetimepicker';

// // // export default function ResumeBuilder() {
// // //   const [sections, setSections] = useState({
// // //     personalInfo: true,
// // //     education: false,
// // //     workExperience: false,
// // //     projects: false,
// // //     skills: false,
// // //   });

// // //   const [fullName, setFullName] = useState('');
// // //   const [profession, setProfession] = useState('');
// // //   const [email, setEmail] = useState('');
// // //   const [phone, setPhone] = useState('');
// // //   const [linkedin, setLinkedin] = useState('');

// // //   const [education, setEducation] = useState('');
// // //   const [educationStartDate, setEducationStartDate] = useState(new Date());
// // //   const [educationEndDate, setEducationEndDate] = useState(new Date());

// // //   const [workExperience, setWorkExperience] = useState([
// // //     { jobTitle: '', companyName: '', startDate: new Date(), endDate: new Date() },
// // //   ]);

// // //   const [projects, setProjects] = useState([
// // //     { projectTitle: '', description: '', link: '' },
// // //   ]);

// // //   const [skills, setSkills] = useState('');
// // //   const [certifications, setCertifications] = useState('');

// // //   const [activeDateField, setActiveDateField] = useState(null);

// // //   const toggleSection = (section) => {
// // //     setSections((prevState) => ({
// // //       ...prevState,
// // //       [section]: !prevState[section],
// // //     }));
// // //   };

// // //   return (
// // //     <ScrollView style={styles.container}>
// // //       <Text style={styles.heading}>Build Your Resume</Text>

// // //       <TouchableOpacity
// // //         style={styles.sectionHeader}
// // //         onPress={() => toggleSection('personalInfo')}
// // //       >
// // //         <Text style={styles.sectionHeaderText}>Personal Information</Text>
// // //         <Ionicons
// // //           name={sections.personalInfo ? 'chevron-up' : 'chevron-down'}
// // //           size={20}
// // //           color="#0782F9"
// // //         />
// // //       </TouchableOpacity>
// // //       {sections.personalInfo && (
// // //         <View style={styles.sectionContent}>
// // //           <TextInput
// // //             style={styles.input}
// // //             placeholder="Full Name"
// // //             value={fullName}
// // //             onChangeText={setFullName}
// // //           />
// // //           <TextInput
// // //             style={styles.input}
// // //             placeholder="Profession"
// // //             value={profession}
// // //             onChangeText={setProfession}
// // //           />
// // //           <TextInput
// // //             style={styles.input}
// // //             placeholder="Email Address"
// // //             value={email}
// // //             onChangeText={setEmail}
// // //           />
// // //           <TextInput
// // //             style={styles.input}
// // //             placeholder="Phone Number"
// // //             value={phone}
// // //             onChangeText={setPhone}
// // //           />
// // //           <TextInput
// // //             style={styles.input}
// // //             placeholder="LinkedIn Profile"
// // //             value={linkedin}
// // //             onChangeText={setLinkedin}
// // //           />
// // //         </View>
// // //       )}

// // //       <TouchableOpacity
// // //         style={styles.sectionHeader}
// // //         onPress={() => toggleSection('education')}
// // //       >
// // //         <Text style={styles.sectionHeaderText}>Education</Text>
// // //         <Ionicons
// // //           name={sections.education ? 'chevron-up' : 'chevron-down'}
// // //           size={20}
// // //           color="#0782F9"
// // //         />
// // //       </TouchableOpacity>
// // //       {sections.education && (
// // //         <View style={styles.sectionContent}>
// // //           <TextInput
// // //             style={styles.input}
// // //             placeholder="Degree or Institution"
// // //             value={education}
// // //             onChangeText={setEducation}
// // //           />
// // //           <TouchableOpacity
// // //             onPress={() => setActiveDateField('educationStartDate')}
// // //             style={styles.datePicker}
// // //           >
// // //             <Text style={styles.dateText}>
// // //               Start Date: {educationStartDate.toDateString()}
// // //             </Text>
// // //           </TouchableOpacity>
// // //           <TouchableOpacity
// // //             onPress={() => setActiveDateField('educationEndDate')}
// // //             style={styles.datePicker}
// // //           >
// // //             <Text style={styles.dateText}>
// // //               End Date: {educationEndDate.toDateString()}
// // //             </Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       )}

// // //       <TouchableOpacity
// // //         style={styles.sectionHeader}
// // //         onPress={() => toggleSection('workExperience')}
// // //       >
// // //         <Text style={styles.sectionHeaderText}>Work Experience</Text>
// // //         <Ionicons
// // //           name={sections.workExperience ? 'chevron-up' : 'chevron-down'}
// // //           size={20}
// // //           color="#0782F9"
// // //         />
// // //       </TouchableOpacity>
// // //       {sections.workExperience && (
// // //         <View style={styles.sectionContent}>
// // //           {workExperience.map((exp, index) => (
// // //             <View key={index} style={styles.subSection}>
// // //               <TextInput
// // //                 style={styles.input}
// // //                 placeholder="Job Title"
// // //                 value={exp.jobTitle}
// // //                 onChangeText={(text) => {
// // //                   const updatedWork = [...workExperience];
// // //                   updatedWork[index].jobTitle = text;
// // //                   setWorkExperience(updatedWork);
// // //                 }}
// // //               />
// // //               <TextInput
// // //                 style={styles.input}
// // //                 placeholder="Company Name"
// // //                 value={exp.companyName}
// // //                 onChangeText={(text) => {
// // //                   const updatedWork = [...workExperience];
// // //                   updatedWork[index].companyName = text;
// // //                   setWorkExperience(updatedWork);
// // //                 }}
// // //               />
// // //               <TouchableOpacity
// // //                 onPress={() =>
// // //                   setActiveDateField(`workExperience.startDate.${index}`)
// // //                 }
// // //                 style={styles.datePicker}
// // //               >
// // //                 <Text style={styles.dateText}>
// // //                   Start Date: {exp.startDate.toDateString()}
// // //                 </Text>
// // //               </TouchableOpacity>
// // //               <TouchableOpacity
// // //                 onPress={() =>
// // //                   setActiveDateField(`workExperience.endDate.${index}`)
// // //                 }
// // //                 style={styles.datePicker}
// // //               >
// // //                 <Text style={styles.dateText}>
// // //                   End Date: {exp.endDate.toDateString()}
// // //                 </Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           ))}
// // //           <TouchableOpacity
// // //             onPress={() => {
// // //               setWorkExperience([
// // //                 ...workExperience,
// // //                 { jobTitle: '', companyName: '', startDate: new Date(), endDate: new Date() },
// // //               ]);
// // //             }}
// // //             style={styles.addButton}
// // //           >
// // //             <Text style={styles.addButtonText}>+ Add Work Experience</Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       )}

// // //     </ScrollView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     padding: 16,
// // //     backgroundColor: '#f9f9f9',
// // //   },
// // //   heading: {
// // //     fontSize: 28,
// // //     fontWeight: 'bold',
// // //     textAlign: 'center',
// // //     marginBottom: 16,
// // //   },
// // //   sectionHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     backgroundColor: '#0782F9',
// // //     padding: 12,
// // //     borderRadius: 8,
// // //     marginBottom: 8,
// // //   },
// // //   sectionHeaderText: {
// // //     fontSize: 18,
// // //     color: '#fff',
// // //     fontWeight: '600',
// // //   },
// // //   sectionContent: {
// // //     backgroundColor: '#fff',
// // //     padding: 12,
// // //     borderRadius: 8,
// // //     marginBottom: 16,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 2,
// // //   },
// // //   input: {
// // //     borderWidth: 1,
// // //     borderColor: '#ccc',
// // //     borderRadius: 8,
// // //     padding: 12,
// // //     marginBottom: 12,
// // //     backgroundColor: '#f9f9f9',
// // //   },
// // //   datePicker: {
// // //     padding: 12,
// // //     backgroundColor: '#f2f2f2',
// // //     borderRadius: 8,
// // //     marginBottom: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#ccc',
// // //   },
// // //   dateText: {
// // //     fontSize: 16,
// // //     color: '#333',
// // //   },
// // //   addButton: {
// // //     padding: 12,
// // //     backgroundColor: '#0782F9',
// // //     borderRadius: 8,
// // //     alignItems: 'center',
// // //     marginTop: 8,
// // //   },
// // //   addButtonText: {
// // //     color: '#fff',
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //   },
// // // });
// // import React, { useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   StyleSheet,
// //   TextInput,
// //   ScrollView,
// //   Platform,
// // } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import DateTimePicker from '@react-native-community/datetimepicker';

// // export default function ResumeBuilder() {
// //   const [sections, setSections] = useState({
// //     personalInfo: true,
// //     education: false,
// //     workExperience: false,
// //     projects: false,
// //     skills: false,
// //   });

// //   const [fullName, setFullName] = useState('');
// //   const [profession, setProfession] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [phone, setPhone] = useState('');
// //   const [linkedin, setLinkedin] = useState('');

// //   const [education, setEducation] = useState('');
// //   const [educationStartDate, setEducationStartDate] = useState(new Date());
// //   const [educationEndDate, setEducationEndDate] = useState(new Date());

// //   const [workExperience, setWorkExperience] = useState([
// //     { jobTitle: '', companyName: '', startDate: new Date(), endDate: new Date() },
// //   ]);

// //   const [activeDateField, setActiveDateField] = useState(null);

// //   const toggleSection = (section) => {
// //     setSections((prevState) => ({
// //       ...prevState,
// //       [section]: !prevState[section],
// //     }));
// //   };

// //   return (
// //     <ScrollView style={styles.container}>
// //       <Text style={styles.heading}>Build Your Resume</Text>

// //       {/* Personal Information */}
// //       <TouchableOpacity
// //         style={styles.sectionHeader}
// //         onPress={() => toggleSection('personalInfo')}
// //       >
// //         <Text style={styles.sectionHeaderText}>Personal Information</Text>
// //         <Ionicons
// //           name={sections.personalInfo ? 'chevron-up' : 'chevron-down'}
// //           size={20}
// //           color="#0782F9"
// //         />
// //       </TouchableOpacity>
// //       {sections.personalInfo && (
// //         <View style={styles.sectionContent}>
// //           <TextInput
// //             style={styles.input}
// //             placeholder="Full Name"
// //             value={fullName}
// //             onChangeText={setFullName}
// //           />
// //           <TextInput
// //             style={styles.input}
// //             placeholder="Profession"
// //             value={profession}
// //             onChangeText={setProfession}
// //           />
// //           <TextInput
// //             style={styles.input}
// //             placeholder="Email Address"
// //             value={email}
// //             onChangeText={setEmail}
// //           />
// //           <TextInput
// //             style={styles.input}
// //             placeholder="Phone Number"
// //             value={phone}
// //             onChangeText={setPhone}
// //           />
// //           <TextInput
// //             style={styles.input}
// //             placeholder="LinkedIn Profile"
// //             value={linkedin}
// //             onChangeText={setLinkedin}
// //           />
// //         </View>
// //       )}

// //       {/* Education */}
// //       <TouchableOpacity
// //         style={styles.sectionHeader}
// //         onPress={() => toggleSection('education')}
// //       >
// //         <Text style={styles.sectionHeaderText}>Education</Text>
// //         <Ionicons
// //           name={sections.education ? 'chevron-up' : 'chevron-down'}
// //           size={20}
// //           color="#0782F9"
// //         />
// //       </TouchableOpacity>
// //       {sections.education && (
// //         <View style={styles.sectionContent}>
// //           <TextInput
// //             style={styles.input}
// //             placeholder="Degree or Institution"
// //             value={education}
// //             onChangeText={setEducation}
// //           />
// //           <TouchableOpacity
// //             onPress={() => setActiveDateField('educationStartDate')}
// //             style={styles.datePicker}
// //           >
// //             <Text style={styles.dateText}>
// //               Start Date: {educationStartDate.toDateString()}
// //             </Text>
// //           </TouchableOpacity>
// //           <TouchableOpacity
// //             onPress={() => setActiveDateField('educationEndDate')}
// //             style={styles.datePicker}
// //           >
// //             <Text style={styles.dateText}>
// //               End Date: {educationEndDate.toDateString()}
// //             </Text>
// //           </TouchableOpacity>
// //           <TouchableOpacity
// //             onPress={() => {
// //               setWorkExperience([
// //                 ...workExperience,
// //                 { jobTitle: '', companyName: '', startDate: new Date(), endDate: new Date() },
// //               ]);
// //             }}
// //             style={styles.addButton}
// //           >
// //             <Text style={styles.addButtonText}>+ Add Work Experience</Text>
// //           </TouchableOpacity>
// //         </View>
        
// //       )}

      

// //       {/* Work Experience */}
// //       <TouchableOpacity
// //         style={styles.sectionHeader}
// //         onPress={() => toggleSection('workExperience')}
// //       >
// //         <Text style={styles.sectionHeaderText}>Work Experience</Text>
// //         <Ionicons
// //           name={sections.workExperience ? 'chevron-up' : 'chevron-down'}
// //           size={20}
// //           color="#0782F9"
// //         />
// //       </TouchableOpacity>
// //       {sections.workExperience && (
// //         <View style={styles.sectionContent}>
// //           {workExperience.map((exp, index) => (
// //             <View key={index} style={styles.subSection}>
// //               <TextInput
// //                 style={styles.input}
// //                 placeholder="Job Title"
// //                 value={exp.jobTitle}
// //                 onChangeText={(text) => {
// //                   const updatedWork = [...workExperience];
// //                   updatedWork[index].jobTitle = text;
// //                   setWorkExperience(updatedWork);
// //                 }}
// //               />
// //               <TextInput
// //                 style={styles.input}
// //                 placeholder="Company Name"
// //                 value={exp.companyName}
// //                 onChangeText={(text) => {
// //                   const updatedWork = [...workExperience];
// //                   updatedWork[index].companyName = text;
// //                   setWorkExperience(updatedWork);
// //                 }}
// //               />
// //               <TouchableOpacity
// //                 onPress={() =>
// //                   setActiveDateField(`workExperience.startDate.${index}`)
// //                 }
// //                 style={styles.datePicker}
// //               >
// //                 <Text style={styles.dateText}>
// //                   Start Date: {exp.startDate.toDateString()}
// //                 </Text>
// //               </TouchableOpacity>
// //               <TouchableOpacity
// //                 onPress={() =>
// //                   setActiveDateField(`workExperience.endDate.${index}`)
// //                 }
// //                 style={styles.datePicker}
// //               >
// //                 <Text style={styles.dateText}>
// //                   End Date: {exp.endDate.toDateString()}
// //                 </Text>
// //               </TouchableOpacity>
// //             </View>
// //           ))}
// //           <TouchableOpacity
// //             onPress={() => {
// //               setWorkExperience([
// //                 ...workExperience,
// //                 { jobTitle: '', companyName: '', startDate: new Date(), endDate: new Date() },
// //               ]);
// //             }}
// //             style={styles.addButton}
// //           >
// //             <Text style={styles.addButtonText}>+ Add Work Experience</Text>
// //           </TouchableOpacity>
// //         </View>
// //       )}

// //       {/* DateTimePicker */}
// //       {activeDateField && (
// //         <DateTimePicker
// //           value={
// //             activeDateField === 'educationStartDate'
// //               ? educationStartDate
// //               : activeDateField === 'educationEndDate'
// //               ? educationEndDate
// //               : workExperience[
// //                   parseInt(activeDateField.split('.')[2], 10)
// //                 ][activeDateField.includes('startDate') ? 'startDate' : 'endDate']
// //           }
// //           mode="date"
// //           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
// //           onChange={(event, selectedDate) => {
// //             if (selectedDate) {
// //               if (activeDateField === 'educationStartDate') {
// //                 setEducationStartDate(selectedDate);
// //               } else if (activeDateField === 'educationEndDate') {
// //                 setEducationEndDate(selectedDate);
// //               } else {
// //                 const index = parseInt(activeDateField.split('.')[2], 10);
// //                 const updatedWork = [...workExperience];
// //                 const field =
// //                   activeDateField.includes('startDate') ? 'startDate' : 'endDate';
// //                 updatedWork[index][field] = selectedDate;
// //                 setWorkExperience(updatedWork);
// //               }
// //             }
// //             setActiveDateField(null);
// //           }}
// //         />
// //       )}
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 16,
// //     backgroundColor: '#f9f9f9',
// //   },
// //   heading: {
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     textAlign: 'center',
// //     marginBottom: 16,
// //   },
// //   sectionHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     backgroundColor: '#0782F9',
// //     padding: 12,
// //     borderRadius: 8,
// //     marginBottom: 8,
// //   },
// //   sectionHeaderText: {
// //     fontSize: 18,
// //     color: '#fff',
// //     fontWeight: '600',
// //   },
// //   sectionContent: {
// //     backgroundColor: '#fff',
// //     padding: 12,
// //     borderRadius: 8,
// //     marginBottom: 16,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: '#ccc',
// //     borderRadius: 8,
// //     padding: 12,
// //     marginBottom: 12,
// //     backgroundColor: '#f9f9f9',
// //   },
// //   datePicker: {
// //     padding: 12,
// //     backgroundColor: '#f2f2f2',
// //     borderRadius: 8,
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: '#ccc',
// //   },
// //   dateText: {
// //     fontSize: 16,
// //     color: '#333',
// //   },
// //   addButton: {
// //     padding: 12,
// //     backgroundColor: '#0782F9',
// //     borderRadius: 8,
// //     alignItems: 'center',
// //     marginTop: 8,
// //   },
// //   addButtonText: {
// //     color: '#fff',
// //     fontSize: 16,
// //     fontWeight: '600',
// //   },
// // });
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

//   const [activeDateField, setActiveDateField] = useState(null);

//   const toggleSection = (section) => {
//     setSections((prevState) => ({
//       ...prevState,
//       [section]: !prevState[section],
//     }));
//   };

//   const handleDateChange = (event, selectedDate, index, field) => {
//     if (selectedDate) {
//       const updatedEducation = [...education];
//       updatedEducation[index][field] = selectedDate;
//       setEducation(updatedEducation);
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
//             <View key={index} style={styles.subSection}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Institution Name"
//                 value={edu.institution}
//                 onChangeText={(text) => {
//                   const updatedEducation = [...education];
//                   updatedEducation[index].institution = text;
//                   setEducation(updatedEducation);
//                 }}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Degree"
//                 value={edu.degree}
//                 onChangeText={(text) => {
//                   const updatedEducation = [...education];
//                   updatedEducation[index].degree = text;
//                   setEducation(updatedEducation);
//                 }}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Field of Study"
//                 value={edu.fieldOfStudy}
//                 onChangeText={(text) => {
//                   const updatedEducation = [...education];
//                   updatedEducation[index].fieldOfStudy = text;
//                   setEducation(updatedEducation);
//                 }}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Grade/Percentage"
//                 value={edu.grade}
//                 onChangeText={(text) => {
//                   const updatedEducation = [...education];
//                   updatedEducation[index].grade = text;
//                   setEducation(updatedEducation);
//                 }}
//               />
//               <TouchableOpacity
//                 onPress={() => setActiveDateField({ index, field: 'startDate' })}
//                 style={styles.datePicker}
//               >
//                 <Text style={styles.dateText}>
//                   Start Date: {edu.startDate.toDateString()}
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => setActiveDateField({ index, field: 'endDate' })}
//                 style={styles.datePicker}
//               >
//                 <Text style={styles.dateText}>
//                   End Date: {edu.endDate.toDateString()}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           ))}
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

//       {/* DateTimePicker */}
//       {activeDateField && (
//         <DateTimePicker
//           value={
//             education[activeDateField.index][activeDateField.field] || new Date()
//           }
//           mode="date"
//           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//           onChange={(event, selectedDate) =>
//             handleDateChange(event, selectedDate, activeDateField.index, activeDateField.field)
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Build Your Resume</Text>

      {/* Personal Information */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection('personalInfo')}
      >
        <Text style={styles.sectionHeaderText}>Personal Information</Text>
        <Ionicons
          name={sections.personalInfo ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#0782F9"
        />
      </TouchableOpacity>
      {sections.personalInfo && (
        <View style={styles.sectionContent}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="Profession"
            value={profession}
            onChangeText={setProfession}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            style={styles.input}
            placeholder="LinkedIn Profile"
            value={linkedin}
            onChangeText={setLinkedin}
          />
        </View>
      )}

      {/* Education */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection('education')}
      >
        <Text style={styles.sectionHeaderText}>Education</Text>
        <Ionicons
          name={sections.education ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#0782F9"
        />
      </TouchableOpacity>
      {sections.education && (
        <View style={styles.sectionContent}>
          {education.map((edu, index) => (
  <View key={index} style={styles.subSection}>
    <TextInput
      style={styles.input}
      placeholder="Institution Name"
      value={edu.institution}
      onChangeText={(text) => {
        const updatedEducation = [...education];
        updatedEducation[index].institution = text;
        setEducation(updatedEducation);
      }}
    />
    <TextInput
      style={styles.input}
      placeholder="Degree"
      value={edu.degree}
      onChangeText={(text) => {
        const updatedEducation = [...education];
        updatedEducation[index].degree = text;
        setEducation(updatedEducation);
      }}
    />
    <TextInput
      style={styles.input}
      placeholder="Field of Study"
      value={edu.fieldOfStudy}
      onChangeText={(text) => {
        const updatedEducation = [...education];
        updatedEducation[index].fieldOfStudy = text;
        setEducation(updatedEducation);
      }}
    />
    <TextInput
      style={styles.input}
      placeholder="Grade"
      value={edu.grade}
      onChangeText={(text) => {
        const updatedEducation = [...education];
        updatedEducation[index].grade = text;
        setEducation(updatedEducation);
      }}
    />
    <TouchableOpacity
      onPress={() =>
        setActiveDateField({ index, field: 'startDate', section: 'education' })
      }
      style={styles.datePicker}
    >
      <Text style={styles.dateText}>
        Start Date: {edu.startDate.toDateString()}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() =>
        setActiveDateField({ index, field: 'endDate', section: 'education' })
      }
      style={styles.datePicker}
    >
      <Text style={styles.dateText}>
        End Date: {edu.endDate.toDateString()}
      </Text>
    </TouchableOpacity>
  </View>
))}

          <TouchableOpacity
            onPress={() =>
              setEducation([
                ...education,
                {
                  institution: '',
                  degree: '',
                  fieldOfStudy: '',
                  grade: '',
                  startDate: new Date(),
                  endDate: new Date(),
                },
              ])
            }
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+ Add Education</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Work Experience */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection('workExperience')}
      >
        <Text style={styles.sectionHeaderText}>Work Experience</Text>
        <Ionicons
          name={sections.workExperience ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#0782F9"
        />
      </TouchableOpacity>
      {sections.workExperience && (
        <View style={styles.sectionContent}>
          {workExperience.map((exp, index) => (
            <View key={index} style={styles.subSection}>
              <TextInput
                style={styles.input}
                placeholder="Job Title"
                value={exp.jobTitle}
                onChangeText={(text) => {
                  const updatedWork = [...workExperience];
                  updatedWork[index].jobTitle = text;
                  setWorkExperience(updatedWork);
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="Company Name"
                value={exp.companyName}
                onChangeText={(text) => {
                  const updatedWork = [...workExperience];
                  updatedWork[index].companyName = text;
                  setWorkExperience(updatedWork);
                }}
              />
              <TouchableOpacity
                onPress={() =>
                  setActiveDateField({ index, field: 'startDate', section: 'workExperience' })
                }
                style={styles.datePicker}
              >
                <Text style={styles.dateText}>
                  Start Date: {exp.startDate.toDateString()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setActiveDateField({ index, field: 'endDate', section: 'workExperience' })
                }
                style={styles.datePicker}
              >
                <Text style={styles.dateText}>
                  End Date: {exp.endDate.toDateString()}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            onPress={() =>
              setWorkExperience([
                ...workExperience,
                {
                  jobTitle: '',
                  companyName: '',
                  startDate: new Date(),
                  endDate: new Date(),
                },
              ])
            }
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+ Add Work Experience</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* DateTimePicker */}
      {activeDateField && (
        <DateTimePicker
          value={
            activeDateField.section === 'education'
              ? education[activeDateField.index][activeDateField.field]
              : workExperience[activeDateField.index][activeDateField.field]
          }
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) =>
            handleDateChange(
              event,
              selectedDate,
              activeDateField.index,
              activeDateField.field,
              activeDateField.section
            )
          }
        />
      )}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0782F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  sectionContent: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  datePicker: {
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    padding: 12,
    backgroundColor: '#0782F9',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  subSection: {
    marginBottom: 16,
  },
});