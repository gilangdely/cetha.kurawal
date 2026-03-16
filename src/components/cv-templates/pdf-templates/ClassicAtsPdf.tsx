import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "@/types/build-cv";

const styles = StyleSheet.create({
  page: {
    padding: "50pt",
    backgroundColor: "#ffffff",
    fontFamily: "Manrope",
    color: "#1a1a1a",
    lineHeight: 1.3,
  },
  header: {
    textAlign: "center",
    marginBottom: "30pt",
    borderBottomWidth: "2pt",
    borderBottomColor: "#1a1a1a",
    borderStyle: "solid",
    paddingBottom: "10pt",
  },
  name: {
    fontSize: "28pt",
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: "5pt",
  },
  contactInfo: {
    fontSize: "10pt",
    color: "#4b5563",
    flexDirection: "row",
    justifyContent: "center",
    gap: "8pt",
  },
  section: {
    marginBottom: "20pt",
  },
  sectionTitle: {
    fontSize: "12pt",
    fontWeight: 700,
    textTransform: "uppercase",
    borderBottomWidth: "1pt",
    borderBottomColor: "#1a1a1a",
    borderStyle: "solid",
    paddingBottom: "3pt",
    marginBottom: "10pt",
  },
  summary: {
    fontSize: "10pt",
  },
  item: {
    marginBottom: "12pt",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "2pt",
  },
  role: {
    fontSize: "11pt",
    fontWeight: 700,
  },
  date: {
    fontSize: "10pt",
    fontWeight: 600,
  },
  company: {
    fontSize: "10pt",
    fontWeight: 600,
    marginBottom: "4pt",
  },
  description: {
    fontSize: "10pt",
  },
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "10pt",
  },
  skillText: {
    fontSize: "10pt",
    fontWeight: 600,
  },
});

export const ClassicAtsPdf = ({ data, style }: { data: ResumeData; style: any }) => {
  const primaryColor = style.fontColor || "#1a1a1a";

  return (
    <Page size="A4" style={styles.page}>
      <View style={[styles.header, { borderBottomColor: primaryColor }]}>
        <Text style={[styles.name, { color: primaryColor }]}>{data.personalInfo.fullName || "Nama Lengkap"}</Text>
        <View style={styles.contactInfo}>
          <Text>{data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.location}</Text>
        </View>
      </View>

      {data.personalInfo.summary && (
        <View style={styles.section} wrap={false}>
          <Text style={[styles.sectionTitle, { borderBottomColor: primaryColor }]}>Professional Summary</Text>
          <Text style={styles.summary}>{data.personalInfo.summary}</Text>
        </View>
      )}

      {data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { borderBottomColor: primaryColor }]}>Work Experience</Text>
          {data.experience.map((exp) => (
            <View key={exp.id} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.role}>{exp.role}</Text>
                <Text style={styles.date}>{exp.startDate} - {exp.endDate || "Present"}</Text>
              </View>
              <Text style={styles.company}>{exp.company}{exp.location ? `, ${exp.location}` : ""}</Text>
              {exp.description && <Text style={styles.description}>{exp.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {data.education.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { borderBottomColor: primaryColor }]}>Education</Text>
          {data.education.map((edu) => (
            <View key={edu.id} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.role}>{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}</Text>
                <Text style={styles.date}>{edu.startDate} - {edu.endDate || "Present"}</Text>
              </View>
              <Text style={styles.company}>{edu.institution}</Text>
              {edu.description && <Text style={styles.description}>{edu.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {data.skills.length > 0 && (
        <View style={styles.section} wrap={false}>
          <Text style={[styles.sectionTitle, { borderBottomColor: primaryColor }]}>Core Competencies</Text>
          <View style={styles.skillContainer}>
            {data.skills.map((skill) => (
              <Text key={skill.id} style={styles.skillText}>• {skill.name}</Text>
            ))}
          </View>
        </View>
      )}
    </Page>
  );
};
