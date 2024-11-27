import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  Animated,
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

  // Input States
  const [fullName, setFullName] = useState('');
  const [profession, setProfession] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const [education, setEducation] = useState('');
  const [educationStartDate, setEducationStartDate] = useState(new Date());
  const [educationEndDate, setEducationEndDate] = useState(new Date());

  const [workExperience, setWorkExperience] = useState([
    { jobTitle: '', companyName: '', startDate: new Date(), endDate: new Date() },
  ]);

  const [projects, setProjects] = useState([
    { projectTitle: '', description: '', link: '' },
  ]);

  const [skills, setSkills] = useState('');
  const [certifications, setCertifications] = useState('');

  const [activeDateField, setActiveDateField] = useState(null);

  // Toggle Section Visibility
  const toggleSection = (section) => {
    setSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Heading */}
      <Text style={styles.heading}>Build Your Resume</Text>

      {/* Section: Personal Information */}
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

      {/* Section: Education */}
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
          <TextInput
            style={styles.input}
            placeholder="Degree or Institution"
            value={education}
            onChangeText={setEducation}
          />
          <TouchableOpacity
            onPress={() => setActiveDateField('educationStartDate')}
            style={styles.datePicker}
          >
            <Text style={styles.dateText}>
              Start Date: {educationStartDate.toDateString()}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveDateField('educationEndDate')}
            style={styles.datePicker}
          >
            <Text style={styles.dateText}>
              End Date: {educationEndDate.toDateString()}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Section: Work Experience */}
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
                  setActiveDateField(`workExperience.startDate.${index}`)
                }
                style={styles.datePicker}
              >
                <Text style={styles.dateText}>
                  Start Date: {exp.startDate.toDateString()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setActiveDateField(`workExperience.endDate.${index}`)
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
            onPress={() => {
              setWorkExperience([
                ...workExperience,
                { jobTitle: '', companyName: '', startDate: new Date(), endDate: new Date() },
              ]);
            }}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+ Add Work Experience</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Other sections follow similar collapsible structures */}
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
});
